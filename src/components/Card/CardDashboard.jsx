import React from "react";
import Styles from "./CardDashboard.module.scss";
import { Grid } from "@mui/material";

function CardDashboard({ headerTitle, subHeaderTitle, color, colorBottom }) {
  return (
    <>
      <Grid item xs={12} md={4} lg={3} sx={{ padding: "24px 18px 0px 0px" }}>
        <div
          className={Styles.card_dashboard}
          style={{ backgroundColor: color, width: "100%", cursor: "pointer" }}
        >
          <div className={Styles.card_top}>
            <h4>{headerTitle}</h4>
            <h6>{subHeaderTitle}</h6>
          </div>
          <div
            className={Styles.card_bottom}
            style={{ backgroundColor: colorBottom }}
          >
            <p>more info</p>
          </div>
          {/* <img src=""></img> */}
        </div>
      </Grid>
    </>
  );
}

export default CardDashboard;
