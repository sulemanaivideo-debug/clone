import { db } from "./db";
import {
  emails,
  type Email,
  type InsertEmail,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getEmails(): Promise<Email[]>;
  getEmail(id: number): Promise<Email | undefined>;
  createEmail(email: InsertEmail): Promise<Email>;
  toggleStar(id: number, isStarred: boolean): Promise<Email | undefined>;
  seedEmails(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getEmails(): Promise<Email[]> {
    return await db.select().from(emails).orderBy(emails.id); // Ordered by ID to keep insertion order roughly
  }

  async getEmail(id: number): Promise<Email | undefined> {
    const [email] = await db.select().from(emails).where(eq(emails.id, id));
    return email;
  }

  async createEmail(insertEmail: InsertEmail): Promise<Email> {
    const [email] = await db.insert(emails).values(insertEmail as any).returning();
    return email;
  }

  async toggleStar(id: number, isStarred: boolean): Promise<Email | undefined> {
    const [updated] = await db
      .update(emails)
      .set({ isStarred })
      .where(eq(emails.id, id))
      .returning();
    return updated;
  }

  async seedEmails(): Promise<void> {
    const existing = await this.getEmails();
    if (existing.length > 0) return;

    const seedData: InsertEmail[] = [
      {
        sender: "Groww Digest",
        senderInitial: "G",
        senderAvatar: "/attached_assets/77ca550a2332ea82f01dd03bfdf6c62f_1767512843767.jpg",
        senderColor: "bg-blue-500",
        subject: "Traders had free money. Then Jap...",
        snippet: "Your weekly all-things-finance newsl...",
        timeDisplay: "8:22 am",
        isUnread: true,
        isStarred: false,
        hasAttachments: false,
      },
      {
        sender: "Groww",
        senderInitial: "G",
        senderAvatar: "/attached_assets/77ca550a2332ea82f01dd03bfdf6c62f_1767512843767.jpg",
        senderColor: "bg-blue-500",
        subject: "Quarterly settlement: Report",
        snippet: "Important notification Settlement rep...",
        timeDisplay: "3 Jan",
        isUnread: true,
        isStarred: false,
        hasAttachments: true,
        attachments: [
          { type: "pdf", name: "RETENTION..." },
          { type: "pdf", name: "CFL_04102..." },
        ],
      },
      {
        sender: "Delta Exchange India",
        senderInitial: "D",
        senderColor: "bg-purple-500",
        subject: "Time to Kickstart Your Trading Journe...",
        snippet: "Notification from Delta Exchange",
        timeDisplay: "3 Jan",
        isUnread: true,
        isStarred: false,
        hasAttachments: false,
      },
      {
        sender: "State Bank of India",
        senderInitial: "S",
        senderAvatar: "/attached_assets/sbi-logo-sbi-icon-free-free-vector_1767513834718.jpg",
        senderColor: "bg-white text-blue-600", // SBI logo-ish
        subject: "Official Notice Regarding Reversal of Credit Transactions",
        snippet: "Dear Mr. Sameer, Greetings...",
        body: `Dear Mr. Sameer,

Greetings from **State Bank of India**.

Please find attached the **official notice** regarding the reversal of certain credit transactions related to your bank account number **XXXXXX0069**.

The attached letter contains detailed information including transaction reference numbers and amounts, issued in accordance with applicable banking regulations and customer safety procedures.

We request you to review the attached document carefully. In case you require any clarification or wish to submit supporting information, please contact your nearest State Bank of India branch for further assistance.

Thank you for your cooperation.

Warm regards,
**State Bank of India**
Customer Support Team

*This is a system-generated email. Please do not reply directly to this message.*`,
        timeDisplay: "3 Jan",
        isUnread: true,
        isStarred: false,
        hasAttachments: true,
        attachments: [
          { type: "pdf", name: "SBI_Reversal_Notice_Sameer.pdf", url: "/attached_assets/SBI_Reversal_Notice_Sameer_1767514491154.pdf" },
        ],
      },
      {
        sender: "Groww",
        senderInitial: "G",
        senderAvatar: "/attached_assets/77ca550a2332ea82f01dd03bfdf6c62f_1767512843767.jpg",
        senderColor: "bg-blue-500",
        subject: "Withdrawal: Successful",
        snippet: "Stay on top of your investments with...",
        timeDisplay: "3 Jan",
        isUnread: false,
        isStarred: false,
        hasAttachments: false,
      },
      {
        sender: "Alerts 6",
        senderInitial: "A",
        senderColor: "bg-green-300 text-black",
        subject: "Important : OTP Email Validation",
        snippet: "Dear Customer, Never share your OT...",
        timeDisplay: "3 Jan",
        isUnread: true,
        isStarred: false,
        hasAttachments: false,
      },
      {
        sender: "Trans",
        senderInitial: "T",
        senderColor: "bg-green-400 text-black",
        subject: "Alert from Utkarsh Small Finance ban...",
        snippet: "Dear customer, Your a/c XX1317 is cre...",
        timeDisplay: "3 Jan",
        isUnread: false,
        isStarred: false,
        hasAttachments: false,
      },
      {
        sender: "Karur Vysya Bank",
        senderInitial: "KVB",
        senderColor: "bg-yellow-400 text-black",
        subject: "Service, Transaction and Promotional...",
        snippet: "Service, Transaction and Promotional...",
        timeDisplay: "3 Jan",
        isUnread: false,
        isStarred: false,
        hasAttachments: false,
      },
      {
        sender: "cbsalerts.sbi 6",
        senderInitial: "SBI",
        senderAvatar: "/attached_assets/sbi-logo-sbi-icon-free-free-vector_1767513834718.jpg",
        senderColor: "bg-white text-blue-600",
        subject: "CBSSBI ALERT",
        snippet: "भारतीय स्टेट बैंक की ओर से शुभकामनाएं ! Gre...",
        timeDisplay: "3 Jan",
        isUnread: false,
        isStarred: false,
        hasAttachments: false,
      },
      {
        sender: "yonobysbi 13",
        senderInitial: "SBI",
        senderAvatar: "/attached_assets/sbi-logo-sbi-icon-free-free-vector_1767513834718.jpg",
        senderColor: "bg-white text-blue-600",
        subject: "Transaction failed",
        snippet: "Dear Sameer ., Fund transfer of Rs.4...",
        timeDisplay: "3 Jan",
        isUnread: true,
        isStarred: false,
        hasAttachments: false,
      }
    ];

    for (const email of seedData) {
      await this.createEmail(email);
    }
  }
}

export const storage = new DatabaseStorage();
