import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export const UrlOnEmail = ({
  orignalUrl,
  creator,
}: {
  orignalUrl: string;
  creator: string;
}) => (
  <Html>
    <Head />
    <Preview>Your url is here</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={paragraph}>
            This tinyurl was created by {creator}, do not open if you don't
            recognise it as the url can contain phishing or spam links!!
          </Text>
          <Text style={paragraph}>
            Click the button to continue to designated url.
          </Text>
          <Button style={button} href={orignalUrl}>
            Continue To Url
          </Button>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default UrlOnEmail;

const main = {
  backgroundColor: "#94a3b8",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#e2e8f0",
  margin: "30px auto 0",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const paragraph = {
  color: "#525f7f",

  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const button = {
  backgroundColor: "#020617",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "10px",
};
