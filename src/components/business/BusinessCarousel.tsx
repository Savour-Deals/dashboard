import React from "react";
import Carousel from "react-multi-carousel";

import Business from "../../model/business";
import CampaignBusinessCard from "../campaign/CampaignBusinessCard";
import { Colors } from "../../constants/Constants";

import 'react-multi-carousel/lib/styles.css';
import Button from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add';
import { createStyles, makeStyles, Theme } from "@material-ui/core";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
		button: {
      backgroundColor: Colors.primary.light,
      color: "white",
      margin: theme.spacing(2),
    },
  }),
);

interface IBusinessCarousel {
  businesses: Business[];
	selectedBusiness: Business;
	onBusinessSelected: (business: Business) => void;
	addBusinessTapped: () => void;
}

export const BusinessCarousel: React.FC<IBusinessCarousel> = props => {
	const { businesses, selectedBusiness, onBusinessSelected, addBusinessTapped } = props;

	const styles = useStyles();

  return (
		<>
			<Button 
				className={styles.button} 
				onClick={addBusinessTapped}>
				<AddIcon/> 
				Add a new business
			</Button>
      {businesses && businesses.length > 1 && 
        <Carousel 
          responsive={responsive}>
          {
            businesses.map((business: Business) => 
              <CampaignBusinessCard
                key={business.id}
                business={business}
                selected={selectedBusiness ? selectedBusiness.id === business.id : false}
                onSelect={onBusinessSelected}/>)
          }
        </Carousel>
      }
		</>
  )
};