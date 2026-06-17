import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Container,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
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

      <Preview>Here's your verification code: {otp}</Preview>

      <Section style={{ backgroundColor: '#ffffff', padding: '40px 0' }}>
        <Container style={{ margin: '0 auto', maxWidth: '600px', backgroundColor: '#fafafa', borderRadius: '8px', padding: '40px', border: '1px solid #eaeaea' }}>
          <Row>
            <Heading as="h2" style={{ color: '#333333', textAlign: 'center', marginBottom: '20px' }}>
              Welcome to Verity, {username}!
            </Heading>
          </Row>
          <Row>
            <Text style={{ color: '#555555', fontSize: '16px', lineHeight: '24px', textAlign: 'center' }}>
              Thank you for registering. To complete your registration and start receiving anonymous messages, please enter the following verification code:
            </Text>
          </Row>
          <Row>
            <Section style={{ backgroundColor: '#f4f4f5', padding: '20px', borderRadius: '8px', margin: '20px 0', textAlign: 'center' }}>
              <Text style={{ fontSize: '32px', fontWeight: 'bold', letterSpacing: '8px', color: '#111111', margin: '0' }}>
                {otp}
              </Text>
            </Section>
          </Row>
          <Row>
            <Text style={{ color: '#888888', fontSize: '14px', textAlign: 'center', marginTop: '30px' }}>
              If you did not request this code, please ignore this email.
            </Text>
          </Row>
        </Container>
      </Section>
    </Html>
  );
}