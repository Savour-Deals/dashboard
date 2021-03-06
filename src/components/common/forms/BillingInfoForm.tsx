import React, { ChangeEvent, useEffect, useState } from "react";
import { 
  makeStyles, 
  Theme, 
  createStyles, 
  TextField, 
  List, 
  ListItem, 
  Typography
} from "@material-ui/core";

import { Alert } from "@material-ui/lab";
import { CardElement, useElements } from "@stripe/react-stripe-js";
import { StripeCardElement } from '@stripe/stripe-js';

interface IBillingInfoForm {
  error?: string;
  onCardChanged: (name: string, card?: StripeCardElement) => void;
}

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    root: {
      flexGrow: 1
    },
    cardField: {
      width: "100%",
      marginBottom: '15px',
      backgroundColor: 'white',
      padding: '11px 16px',
      borderRadius: '6px',
      border: '1px solid #CCC',
      boxShadow: 'inset 0 1px 1px rgba(102, 175, 233, 0.6)',
      lineHeight: '1.3333333'
    }
  })
);

export const BillingInfoForm: React.FC<IBillingInfoForm> = props => {
  const styles = useStyles();
  const elements = useElements();
  const { error, onCardChanged } = props;

  const [cardName, setCardName] = useState<string>(""); 
  const [cardElement, setCardElement] = useState<StripeCardElement | undefined>();

  function cardNameChange(event: ChangeEvent<HTMLInputElement>) {
    setCardName(event.target.value);
  }

  function onElementChanged() {
    if (!elements) { 
      return;
    }
    
    const cardElement = elements.getElement(CardElement) ?? undefined;
    setCardElement(cardElement);
  }

  useEffect(() => {
    onCardChanged(cardName, cardElement);
  }, [cardName, cardElement, onCardChanged]);
  
  return ( 
    <List className={styles.root}>
      <ListItem>
        <Typography variant="h3">
          Billing Info
        </Typography>
      </ListItem>
      <ListItem>
        <Typography variant="body1">
          Enter your business billing information. Our payment structure is simple. You pay:
        </Typography>
      </ListItem>
      <ListItem>
        <List>
          <ListItem>
            <Typography variant="body1">
              &#8226; $45/month subscription fee
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              &#8226; $0.02 for every message sent
            </Typography>
          </ListItem>
        </List>
      </ListItem>
      {error && 
        <ListItem>
          <Alert severity="error">
            {error}
          </Alert>
        </ListItem>
      }  
      <ListItem>
        <TextField
          variant="outlined"
          label="Name on Card"
          fullWidth
          onChange={cardNameChange}
        />
      </ListItem>
      <ListItem>
        <CardElement
          className={styles.cardField}
          onChange={onElementChanged}
          options={{
            style: {
              base: { fontSize: "18px", fontFamily: '"Open Sans", sans-serif' }
            }
          }}/>
      </ListItem>
    </List>
  );
}

