import React, { useState } from "react";

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert/Alert";
import {
  Card, 
  CardContent, 
  CardHeader, 
  Button, 
  Grid,
  Typography

} from "@material-ui/core";

import { Loading } from "../common/Loading";
import CampaignBusinessCard from "./CampaignBusinessCard";
import { AuthenticatedPageProperties } from "../../model/page";
import Business, { Campaign } from "../../model/business";
import AddCampaignModal from "./AddCampaignModal";
import { v4 as uuidv4 } from 'uuid';

import { UpdateBusiness } from "../../accessor/Business";
import useFetchCampaign from "../hooks/useFetchCampaign";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      textAlign: "center",
      alignItems: "center",
      alignContent: "center",
      paddingLeft: 250,
      [theme.breakpoints.only('sm')]: {
        paddingLeft: theme.spacing(1),
      },
      padding: theme.spacing(1),
      ...theme.mixins.toolbar
    },
    img: {
        maxWidth:"15%",
        height:"auto",
    },
    button: {
      backgroundColor: "#49ABAA",
      color: "white",
      margin: theme.spacing(2),
    },
    title: {
      padding: theme.spacing(2),
    },
    businessCards: {
      minWidth: "80%",
    },
  }),
);



export const Campaigns: React.FC<AuthenticatedPageProperties> = props => {
  const { loading, businesses, setBusinesses } = props;
  const styles = useStyles();

  const [modalOpen, setModalOpen] = useState(false);
  const { campaigns, setCampaigns, error } = useFetchCampaign(businesses);

  const addCampaign = (campaign: Campaign) => setCampaigns([...campaigns, campaign]);

  const createBusinessCards = (businesses: Array<Business>) : Array<JSX.Element> => {
    return businesses.map((business: Business): JSX.Element => (
      <Grid item xs={12} className={styles.businessCards}> 
        <CampaignBusinessCard
          business={business}
        />
      </Grid>
      )
    );
  };

  const createCampaignCards = (campaigns: Array<Campaign>) : Array<JSX.Element> => {
    const campaignCards: Array<JSX.Element> = [];
  
    return campaignCards;
  }

  const handleModalClose = () => {
    setModalOpen(false);  
  };

  return (
    <>
          {loading &&
        <Loading />
      }
      {error && 
      <Alert severity="error">
        {error}
      </Alert>
      }  
      <div className={styles.root}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
          <Card>
                <CardHeader
                />
                <CardContent>
                <Grid container spacing={1} alignItems="center" direction="column">
                  <Grid item xs={6}>
                  <Typography variant="h3" className={styles.title}>
                    Businesses
                  </Typography>
                  </Grid>
                  {createBusinessCards(businesses)}
                </Grid>
                </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
                <CardHeader
                />
                <CardContent>

                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={12}>
                  <Typography variant="h3" className={styles.title}>
                    Campaigns
                  </Typography>
                  </Grid>
                  {createCampaignCards(campaigns)}
                </Grid>
                </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Button className={styles.button} onClick={() => setModalOpen(true)}>
              Run New Campaign
            </Button>
          </Grid>
        </Grid>
        <AddCampaignModal
          modalOpen={modalOpen}
          handleModalClose={handleModalClose}
          businesses={businesses} 
          setBusinesses={setBusinesses}
          addCampaign={addCampaign}
        />
      </div>
    </>
  )
};