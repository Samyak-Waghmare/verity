import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Convert the React email template into static HTML
        const emailHtml = await render(VerificationEmail({ username, otp: verifyCode }));

        const options = {
            from: `"Verity" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verity | Your Verification Code',
            html: emailHtml,
        };

        await transporter.sendMail(options);

        return {success: true, message: 'Verification email sent successfully'}
    } catch (emailError) {
        return {success: false, message: 'Failed to send verification email'}
    }
}
