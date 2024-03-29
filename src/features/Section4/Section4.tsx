import emailjs from "@emailjs/browser";
import { Formik, FormikErrors, FormikHelpers } from "formik";
import { useRef, useState } from "react";
import styled from "styled-components";

import Container from "@/components/Container";
import GridItem from "@/components/GridItem";
import ReCaptcha from "@/features/Section4/ReCaptcha";
import SubmitButton from "@/features/Section4/SubmitButton";
import TextAreaInput from "@/features/Section4/TextAreaInput";
import TextInput from "@/features/Section4/TextInput";

function validateEmail(email: string) {
  const regEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  return regEx.test(email);
}

const Root = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${({ theme }) => theme.bg.section4};
  padding: 24px 0;
  @media (min-width: 600px) {
    padding: 24px 0;
  }
  @media (min-width: 960px) {
    padding: 36px 0;
  }
  @media (min-width: 1280px) {
    padding: 48px 0;
  }
  @media (min-width: 1920px) {
    padding: 72px 0;
  }
`;

const GridContainer = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    "name name"
    "email email"
    "message message"
    "recaptcha recaptcha"
    "submit submit";
  @media (min-width: 900px) {
    grid-template-areas:
      "name email"
      "message message"
      "recaptcha recaptcha"
      "submit submit";
  }
`;

const Title = styled.h1`
  font-size: 44px;
  color: #fff;
  margin: 0;
`;

const Paragraph = styled.p`
  margin-bottom: 32px;
  font-size: 18px;
  color: #fff;
`;

const GridItemSubmit = styled(GridItem)`
  align-items: center;
  justify-content: space-between;
`;

const ErrorText = styled.p`
  max-width: 50vw;
  margin: 0;
  color: #fff;
`;

type FormValues = {
  name: string;
  email: string;
  message: string;
};

function Section4() {
  const [loadingState, setLoadingState] = useState("Ready");
  const [errorMessage, setErrorMessage] = useState("");
  const [shouldRenderCaptcha, setShouldRenderCaptcha] = useState(false);
  const captchaRef = useRef<any>(null);

  const handleFormSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    try {
      const token = await captchaRef.current?.executeAsync();
      setLoadingState("Loading");
      setErrorMessage("");

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID as string,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string,
        { ...values, "g-recaptcha-response": token },
        import.meta.env.VITE_EMAILJS_USER_ID as string,
      );
      setLoadingState("Success");
      resetForm();
    } catch (e) {
      setLoadingState("Error");
      setErrorMessage(
        "Something went wrong. Please try again or contact me via social media",
      );
    } finally {
      setTimeout(() => {
        setLoadingState("Ready");
      }, 2000);
    }
  };

  const initialValues: FormValues = {
    name: "",
    email: "",
    message: "",
  };

  const loadCaptcha = () => {
    if (!shouldRenderCaptcha) {
      setShouldRenderCaptcha(true);
    }
  };

  return (
    <Root>
      <Container id="section4" maxWidth={900} padding="16px">
        <Title>Say hello</Title>
        <Paragraph>
          You can contact me using this form or via any of my social media.
          Links can be found below.
        </Paragraph>
        <Formik
          initialValues={initialValues}
          validateOnBlur={false}
          validateOnChange={false}
          validate={(values) => {
            const errors: FormikErrors<FormValues> = {};

            if (!values.name) {
              errors.name = "Required";
            }
            if (!validateEmail(values.email)) {
              errors.email = "Invalid email";
            }
            if (!values.email) {
              errors.email = "Required";
            }
            if (!values.message) {
              errors.message = "Required";
            }

            return errors;
          }}
          onSubmit={handleFormSubmit}
        >
          {({ values, errors, handleChange, handleSubmit }) => (
            <form autoComplete="off" onSubmit={handleSubmit}>
              <GridContainer>
                <GridItem name="name">
                  <TextInput
                    label="Name"
                    name="name"
                    onChange={handleChange}
                    value={values.name}
                    type="text"
                    autoComplete="off"
                    onFocus={loadCaptcha}
                  />
                </GridItem>
                <GridItem name="email">
                  <TextInput
                    label="Email"
                    name="email"
                    onChange={handleChange}
                    value={values.email}
                    type="text"
                    autoComplete="off"
                    onFocus={loadCaptcha}
                  />
                </GridItem>
                <GridItem name="message">
                  <TextAreaInput
                    label="Message"
                    name="message"
                    onChange={handleChange}
                    rows={5}
                    value={values.message}
                    onFocus={loadCaptcha}
                  />
                </GridItem>
                <GridItem name="recaptcha">
                  <ReCaptcha
                    ref={captchaRef}
                    shouldRender={shouldRenderCaptcha}
                  />
                </GridItem>
                <GridItemSubmit name="submit">
                  <SubmitButton
                    state={loadingState}
                    disabled={loadingState !== "Ready"}
                  />
                  <ErrorText>
                    {errors.name === "Required" ||
                    errors.email === "Required" ||
                    errors.message === "Required"
                      ? "Fill all the fields"
                      : errors.email === "Invalid email"
                      ? "Invalid email address"
                      : errorMessage}
                  </ErrorText>
                </GridItemSubmit>
              </GridContainer>
            </form>
          )}
        </Formik>
      </Container>
    </Root>
  );
}

export default Section4;
