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
  export default function TicketEmail({ email, ticketId }) {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <title>Ticket Assigned to you</title>
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
        <Preview>Here&apos;s your assigned Ticket ID: {ticketId}</Preview>
        <Section>
          <Row>
            <Heading as="h2">Hello {email.split("@")[0]},</Heading>
          </Row>
          <Row>
            <Text>
              Thank you for your attention. The Ticket ID {ticketId} has been assigned to your by our system. So please try to resolve the user query as soons as possible.
            </Text>
          </Row>
          <Row>
            <Text>
              You can visit the site and see the ticket
            </Text>
          </Row>
           <Row>
            <Button
              href={`http://localhost:3000/verify/${username}`}
              style={{ color: '#61dafb' }}
            >
              Visit here
            </Button>
          </Row> 
        </Section>
      </Html>
    );
  }