// Here we're using React Email which is A collection of high-quality, unstyled components for creating beautiful emails using React and TypeScript.

import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,
  } from '@react-email/components';
  

//   It's the template for email
  export default function RegistraionEmail({ email }) {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <title>Registered Successfully</title>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Section>
          <Row>
            <Heading as="h2">Hello {email.split("@")[0]},</Heading>
          </Row>
          <Row>
            <Text>
              Thank you for registering in our Platform Ticket AI. Here our moderators will help you to resolve your queries and issues in any kind of application Web, Mobile, Embedded and IOT and many more. You just need to raise a ticket!.
            </Text>
          </Row>

          <Row>
            <Text>
              If you did not request this code, please ignore this email.
            </Text>
          </Row>
           <Row>
            <Button
              href={`http://localhost:3000/verify/${username}`}
              style={{ color: '#61dafb' }}
            >
              Verify here
            </Button>
          </Row> 
        </Section>
      </Html>
    );
  }