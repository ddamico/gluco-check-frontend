import React from "react";
import { useTranslation } from "react-i18next";
import {
  Container,
  Grid,
  Link,
  makeStyles,
  Typography,
} from "@material-ui/core";

const assistantIcon = require("../images/icon-assistant.svg");

const useStyles = makeStyles((theme) => ({
  contentGrid: {
    height: "90vh",
  },
  callResponseContainer: {
    "& .assistantBubble img": {
      width: "54px",
      height: "54px",
      display: "block",
      paddingBottom: theme.spacing(2),
      float: "right",
    },
    "& .assistantBubble-question, & .assistantBubble-response": {},
    "& .assistantBubble p": {
      clear: "both",
      marginBottom: theme.spacing(2),
      padding: "14px 30px",
      borderRadius: "62px",
      borderWidth: "2px",
      borderStyle: "solid",
    },
    "& .assistantBubble-question": {
      textAlign: "start",
      alignSelf: "flex-start",
    },
    "& .assistantBubble-question p": {
      backgroundColor: "#ccc",
      borderColor: "#ccc",
      maxWidth: "70%",
    },
    "& .assistantBubble-response": {
      textAlign: "end",
      alignSelf: "flex-end",
    },
    "& .assistantBubble-response p": {
      borderColor: "#e8eaed",
      textAlign: "inline-end",
    },
    [theme.breakpoints.down("sm")]: {
      "& .assistantBubble-response, & .assistantBubble-response": {
        fontSize: ".9rem",
      },
    },
  },
}));

const questionAndAnswer = (
  containerClass: string,
  question: string,
  answer: string,
  index: number
) => {
  return (
    <Grid container direction="column" className={containerClass} key={index}>
      <Grid item className="assistantBubble assistantBubble-question">
        <Typography variant="h5" component="p">
          Hey Google, ask Gluco Check my blood sugar
        </Typography>
      </Grid>
      <Grid item className="assistantBubble assistantBubble-response">
        <img src={assistantIcon} alt=""></img>
        <Typography variant="h5" component="p">
          6.5 and steady as of five minutes ago
        </Typography>
      </Grid>
    </Grid>
  );
};

function Onboarding() {
  const classes = useStyles();
  const { t } = useTranslation();

  const questionsAndAnswers = [
    {
      question: t("onboarding.q1"),
      answer: t("onboarding.a1"),
    },
  ];

  return (
    <Container maxWidth="md">
      {questionsAndAnswers.map((item, index) =>
        questionAndAnswer(
          classes.callResponseContainer,
          item.question,
          item.answer,
          index
        )
      )}
    </Container>
  );
}

export default Onboarding;
