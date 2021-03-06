import React, { 
  useState, 
  useContext,
  useCallback
} from "react";
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import { 
  createStyles, 
  Button, 
  makeStyles, 
  Theme, 
  List, 
  ListItem, 
  Typography,
  DialogContent,
  DialogTitle,
  DialogActions
} from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';

import { StripeCardElement } from '@stripe/stripe-js';
import { useStripe } from "@stripe/react-stripe-js";

import Loader from "react-loader-spinner";
import { v4 as uuidv4 } from 'uuid';

import { UserContext } from "../../../auth/UserContext";
import { CreateNumber } from "../../../accessor/Message";
import { CreateBusiness } from "../../../accessor/Business";
import { CreateSubscription } from "../../../accessor/Payment";
import Business, { SubscriberInfo } from "../../../model/business";
import Campaign from "../../../model/campaign";
import { Colors } from "../../../constants/Constants";
import config from "../../../config";
import { UpdateBusinessUser } from "../../../accessor/BusinessUser";
import BusinessUser from "../../../model/businessUser";
import { BillingInfoForm } from "../../common/forms/BillingInfoForm";
import { BusinessInfoForm } from "../../common/forms/BusinessInfoForm";
import { MessageInputForm } from "../../common/forms/MessageInputForm";

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
      width: "70%",
    },
    card: {
      overflow: 'scroll',
      display: "inline-block",
    },
    inputList: {
      flexGrow: 1
    },
    cardContent: {
      alignItems: 'center',
    },
    button: {
      backgroundColor: Colors.primary.light,
      color: "white",
      margin: theme.spacing(2),
    },
    formFields: {
      margin: '25px',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '75%',
      outline: '1px solid slategrey',
      boxShadow: '5px 5px 5px #888888'
    },
    dialogCustomizedWidth: {
      width: '80%',
      [theme.breakpoints.down('sm')]: {
        width: "100%",
      },
    }
  })
);

interface IAddBusinessModal {
  businessUser: BusinessUser;
  width: any;
  onClose: (business?: Business) => void;
  onError: (error: string) => void;
}

const AddBusinessModal: React.FC<IAddBusinessModal> = props => {
  const styles = useStyles();

  const { 
    businessUser,
    onClose, 
    onError,
  } = props;


  const [isLoading, setIsLoading] = useState(false);

  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");

  const [presetMessages, setPresetMessages] = useState<string[]>([""]); //always start with at least one blank preset
  const [onboardMessage, setOnboardMessage] = useState("");
  
  const userContext: IUserContext = useContext(UserContext);

  const [cardName, setCardName] = useState<string | undefined>();
  const [cardElement, setCardElement] = useState<StripeCardElement | undefined>();
  const [paymentError, setPaymentError] = useState<string>();

  const stripe = useStripe();



  const onCardChanged = useCallback((name: string, element?: StripeCardElement) => {
    setCardName(name);
    setCardElement(element);
  }, []);

  const onBusinessInfoChange = useCallback((name: string, address: string) => {
    setBusinessName(name);
    setAddress(address);
  }, []);
  
  
  const createBusiness = async () => {
    if (!cardElement || !cardName || !businessName || !address || !onboardMessage || !presetMessages || !stripe) {
      return 
    }

    setIsLoading(true);
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        email: userContext.user.email,
        // name: cardName,
      },
    });

    if (error || !paymentMethod) {
      setPaymentError("There was an error processing your payment.");
      setIsLoading(false);
      return;
    }

    const business = {
      id: uuidv4(),
      businessName,
      address,
      presetMessages,
      onboardMessage,
      subscriberMap: new Map<string, SubscriberInfo>(),
      campaignsMap: new Map<string, Campaign>(),
    };
    
    return Promise.all([
      CreateBusiness(business),
      CreateNumber(business.id),
    ]).then(() => {
      return Promise.all([
        CreateSubscription(business.id, {
          email: userContext.user.attributes.email,
          name: businessName,
          paymentMethod: paymentMethod.id,
          subscriptions: {
            recurring: config.stripe.RECURRING_ID,
            usage: config.stripe.USAGE_ID,
          }
        }),
        UpdateBusinessUser({
          ...businessUser,
          businesses: [...businessUser.businesses, business.id]
        }),
      ]); 
    }).then(() => {
      setIsLoading(false);
      onClose(business);
    }).catch((e) => {
      console.log(e)
      setIsLoading(false);
      onError(`An error occured while creating ${business.businessName}`);  
    });
  }

  return (
    <Dialog 
      classes={{ paperFullWidth: styles.dialogCustomizedWidth }}
      onClose={() => onClose()} 
      open
      fullScreen={!isWidthUp('md', props.width)}
      fullWidth={isWidthUp('md', props.width)}>
      <DialogTitle className={styles.root} disableTypography>
        <Typography variant="h2">
          Add Business
        </Typography>
      </DialogTitle>
      <DialogContent className={styles.cardContent} >
        <Dialog open={isLoading}>
          <Loader type="ThreeDots" color={Colors.primary.light} height={100} width={100}/>
        </Dialog>
        <form>
            <BusinessInfoForm
              onChange={onBusinessInfoChange}
            />
            <List className={styles.inputList}>
              <ListItem>
                <Typography variant="h3">
                  Setup Messages
                </Typography>
              </ListItem>
              <MessageInputForm
                onUpdatePresetMessages={setPresetMessages}
                onUpdateOnboardingMessage={setOnboardMessage}
                presetMessages={presetMessages}
                onboardingMessage={onboardMessage}/>
            </List>
            <BillingInfoForm
              error={paymentError}
              onCardChanged={onCardChanged}
            />
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => onClose()}>
            Cancel
        </Button>
        <Button
          disabled={isLoading}
          variant="contained"
          className={styles.button} 
          onClick={createBusiness}>
          Create Business
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withWidth()(AddBusinessModal);
