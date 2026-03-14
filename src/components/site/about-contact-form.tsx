"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type AboutContactFormProps = {
  destinationEmail: string;
};

export function AboutContactForm({ destinationEmail }: AboutContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const wordCount =
    message.trim() === "" ? 0 : message.trim().split(/\s+/).length;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subjectName = name.trim() === "" ? "Website Visitor" : name.trim();
    const emailLine = email.trim() === "" ? "Not provided" : email.trim();
    const phoneLine = phone.trim() === "" ? "Not provided" : phone.trim();
    const messageLine =
      message.trim() === "" ? "No message entered." : message.trim();

    const subject = `BBER inquiry from ${subjectName}`;
    const body = [
      `Name: ${subjectName}`,
      `Email: ${emailLine}`,
      `Phone: ${phoneLine}`,
      "",
      "Message:",
      messageLine,
    ].join("\n");

    window.location.href = `mailto:${destinationEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <Card className="border border-[var(--bber-border)] bg-white py-0 shadow-sm">
      <CardHeader className="px-6 pt-6">
        <CardTitle className="font-display text-3xl text-[var(--bber-red)]">
          Send Us a Message
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="contact-name"
              className="text-sm font-medium text-[var(--bber-ink)]"
            >
              Name
            </label>
            <Input
              id="contact-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="contact-email"
                className="text-sm font-medium text-[var(--bber-ink)]"
              >
                Email
              </label>
              <Input
                id="contact-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="contact-phone"
                className="text-sm font-medium text-[var(--bber-ink)]"
              >
                Phone
              </label>
              <Input
                id="contact-phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="(505) 555-1234"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="contact-message"
              className="text-sm font-medium text-[var(--bber-ink)]"
            >
              Message
            </label>
            <Textarea
              id="contact-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="How can BBER help?"
              className="min-h-40"
            />
            <p className="text-sm text-[var(--bber-ink)]/65">
              Word Count: {wordCount}
            </p>
          </div>

          <Button type="submit" className="w-full md:w-auto">
            Send Message
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
