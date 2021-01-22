import React from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  Container,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";

import { CarouselProvider, Slide, Slider } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";

import { DEFAULT_ONBOARDING_CAROUSEL_INTERVAL } from "../lib/constants";

const assistantIcon = require("../images/icon-assistant.svg");

const useStyles = makeStyles((theme) => ({
  slideContainer: {
    padding: theme.spacing(2),
    margin: theme.spacing(1),
  },
  callResponseContainer: {
    height: "100%",
    maxHeight: "330px",
    width: "100%",
    "& .assistantBubble img": {
      width: "54px",
      height: "54px",
      display: "block",
      paddingBottom: theme.spacing(2),
      float: "right",
    },
    "& .assistantBubble-question, & .assistantBubble-response": {
      maxWidth: "70%",
    },
    "& .assistantBubble p": {
      clear: "both",
      marginBottom: theme.spacing(2),
      padding: "14px 30px",
      borderRadius: "62px",
      borderWidth: "2px",
      borderStyle: "solid",
    },
    "& .assistantBubble p:last-of-type": {
      marginBottom: "0",
    },
    "& .assistantBubble-question": {
      textAlign: "start",
      alignSelf: "flex-start",
    },
    "& .assistantBubble-question p": {
      backgroundColor: "#ccc",
      borderColor: "#ccc",
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
      "& .assistantBubble p": {
        padding: "7px 15px",
        borderRadius: "20px",
      },
      "& .assistantBubble img": {
        margin: "0",
        paddingBottom: theme.spacing(1),
      },
      "& .assistantBubble-question p.MuiTypography-h5, & .assistantBubble-response p.MuiTypography-h5": {
        fontSize: ".9rem",
      },
      "& .assistantBubble-question p.MuiTypography-body2, & .assistantBubble-response p.MuiTypography-body2": {
        fontSize: ".7rem",
      },
    },
  },
  carousel: {
    minWidth: "80vw",
    [theme.breakpoints.down("sm")]: {
      minWidth: "98vw",
    },
    "& .carousel__dot": {
      marginRight: theme.spacing(1),
    },
    "& .carousel__dot:last-of-type": {
      marginRight: "0",
    },
  },
  carouselSliderContainer: {
    width: "100%",
  },
  carouselSlider: {
    minHeight: "330px",
    backgroundColor: "#ccc",
  },
}));

export const questionAndAnswer = (
  containerClass: string,
  innerContainerClass: string,
  question: string,
  answer: string,
  index: number
) => {
  const answerVariant = answer.length > 40 ? "body2" : "h5";
  return (
    <Card className={innerContainerClass}>
      <Grid
        className={containerClass}
        container
        direction="column"
        key={index}
        wrap="nowrap"
      >
        <Grid item className="assistantBubble assistantBubble-question">
          <Typography variant="h5" component="p">
            {question}
          </Typography>
        </Grid>
        <Grid item className="assistantBubble assistantBubble-response">
          <img src={assistantIcon} alt="" />
          <Typography variant={answerVariant} component="p">
            {answer}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

interface QuestionsAndAnswer {
  question: string;
  answer: string;
}

function Onboarding() {
  const classes = useStyles();
  const { t } = useTranslation();

  const questionsAndAnswers: QuestionsAndAnswer[] = [
    {
      question: t("onboarding.q1"),
      answer: t("onboarding.a1"),
    },
    {
      question: t("onboarding.q2"),
      answer: t("onboarding.a2"),
    },
    {
      question: t("onboarding.q3"),
      answer: t("onboarding.a3"),
    },
  ];

  return (
    <CarouselProvider
      className={classes.carousel}
      infinite={true}
      interval={DEFAULT_ONBOARDING_CAROUSEL_INTERVAL}
      isPlaying={true}
      naturalSlideHeight={330}
      naturalSlideWidth={600}
      totalSlides={questionsAndAnswers.length}
    >
      <Container maxWidth="sm">
        <Grid
          alignItems="center"
          container
          direction="column"
          justify="center"
          spacing={2}
        >
          <Grid item className={classes.carouselSliderContainer}>
            <Slider className={classes.carouselSlider}>
              {questionsAndAnswers.map((item, index) => (
                <Slide index={index} key={`slide-${index}`}>
                  {questionAndAnswer(
                    classes.callResponseContainer,
                    classes.slideContainer,
                    item.question,
                    item.answer,
                    index
                  )}
                </Slide>
              ))}
            </Slider>
          </Grid>
        </Grid>
      </Container>
    </CarouselProvider>
  );
}

export default Onboarding;
