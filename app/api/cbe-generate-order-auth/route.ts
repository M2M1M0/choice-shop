import { NextRequest, NextResponse } from "next/server";
import {
  generateConfirmPayloadHMAC,
  generateSignEd25519,
} from "../../lib/cbe/sign";

type GenerateOrderAuthRequest = {
  app_code: string;
  merchant_code: string;
  merchant_reference: string;
  title: string;
  total_amount: number | string;
  currency: string;
  credit_account_number?: string;
};

export async function POST(req: NextRequest) {
  const appSecret = process.env.NEXT_CHOICE_APP_SECRET || ""
  const privateKeyBase64 = process.env.NEXT_CHOICE_PRIVATE_KEY || ""

  if (!appSecret || !privateKeyBase64) {
    return NextResponse.json(
      {
        error: "Server is missing signing env vars",
        missing: [
          !appSecret ? "CHOICE_APP_SECRET" : null,
          !privateKeyBase64 ? "CHOICE_PRIVATE_KEY" : null,
        ].filter(Boolean),
      },
      { status: 500 }
    );
  }

  let body: GenerateOrderAuthRequest;
  try {
    body = (await req.json()) as GenerateOrderAuthRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    app_code,
    merchant_code,
    merchant_reference,
    title,
    total_amount,
    currency,
    credit_account_number,
  } = body;

  if (
    !app_code ||
    !merchant_code ||
    !merchant_reference ||
    !title ||
    !currency ||
    total_amount === undefined ||
    total_amount === null
  ) {
    return NextResponse.json(
      {
        error: "Missing required fields",
        required: [
          "app_code",
          "merchant_code",
          "merchant_reference",
          "title",
          "total_amount",
          "currency",
        ],
      },
      { status: 400 }
    );
  }

  const totalAmountNumber =
    typeof total_amount === "number"
      ? total_amount
      : Number.parseFloat(total_amount);

  if (Number.isNaN(totalAmountNumber)) {
    return NextResponse.json(
      { error: "total_amount must be a number or numeric string" },
      { status: 400 }
    );
  }

  const contentToSign = {
    app_code,
    merchant_code,
    merchant_reference,
    title,
    total_amount: totalAmountNumber,
    currency,
    credit_account_number: credit_account_number ?? "",
  };

  try {
    const sign = generateSignEd25519(contentToSign, privateKeyBase64);
    const confirm_payload = generateConfirmPayloadHMAC(
      contentToSign,
      appSecret
    );

    return NextResponse.json({ sign, confirm_payload });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: "Failed to generate order auth", message }, { status: 500 });
  }
}

