import { configDotenv } from "dotenv";
configDotenv()
export const PORT :string|number = process.env.PORT || 3000
export const db :string  = process.env.db || "" 
export const MAIL_HOST:string = process.env.MAIL_HOST || ""
export const MAIL_PASSWORD:string = process.env.MAIL_PASSWORD ||""
export const MAIL_USERNAME:string = process.env.MAIL_USERNAME || ""
export const MAIL_SECURE : string|boolean = process.env.MAIL_SECURE || false 
export const MAIL_PORT  : string = process.env.MAIL_PORT || "587"
export const JWT_AUTH :string = process.env.JWT_AUTH || "screect"