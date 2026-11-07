"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Check, Loader2, Mail, MapPin, Send } from "lucide-react";
import { profile } from "@/data/profile";
import { SplitLines, Reveal } from "@/components/ui/Motion";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/site";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot — visually hidden, never announced, must stay empty. */
  website: string;
}

type FieldName = keyof FormState;
type Errors = Partial<Record<FieldName, string>>;

const emptyForm: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Inlined at build time — true for `output: "export"` deployments. */
const STATIC_MODE = process.env.NEXT_PUBLIC_STATIC_MODE === "1";

const fields: {
  name: FieldName;
  label: string;
  placeholder: string;
  type: "text" | "email";
  span: string;
  autoComplete: string;
}[] = [
  { name: "name", label: "YOUR NAME", placeholder: "Ada Lovelace", type: "text", span: "sm:col-span-1", autoComplete: "name" },
  { name: "email", label: "EMAIL ADDRESS", placeholder: "ada@analytical.engine", type: "email", span: "sm:col-span-1", autoComplete: "email" },
  { name: "subject", label: "SUBJECT", placeholder: "Project / role / collaboration", type: "text", span: "sm:col-span-2", autoComplete: "off" },
];

export function Contact() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [reference, setReference] = useState("");
  // Timestamp of when the form was first shown — used to reject instant bot
  // submissions. Initialised in an effect so render stays pure.
  const openedAt = useRef<number>(0);

  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  const validate = (): Errors => {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "Enter your name (2+ characters).";
    if (!emailPattern.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (form.subject.trim().length < 3) next.subject = "Add a subject (3+ characters).";
    if (form.message.trim().length < 12) next.message = "Add a message (12+ characters).";
    return next;
  };

  /**
   * Static deployments (GitHub Pages and friends) have no API route. Rather
   * than showing a broken form, compose a prefilled email in the visitor's own
   * mail client — the message still reaches the same inbox.
   */
  const openMailtoFallback = () => {
    const body = [
      `From: ${form.name} <${form.email}>`,
      "",
      form.message,
      "",
      "— sent from arifrahman.dev",
    ].join("\n");
    const href = `mailto:${profile.email}?subject=${encodeURIComponent(
      `[Portfolio] ${form.subject}`,
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      setFeedback("Some fields need attention before this can send.");
      return;
    }

    if (STATIC_MODE) {
      openMailtoFallback();
      setStatus("success");
      setReference("MAILTO");
      setFeedback("Your mail app should be open with the message ready to send.");
      return;
    }

    setStatus("submitting");
    setFeedback("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, elapsed: Date.now() - openedAt.current }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        message?: string;
        errors?: Errors;
        reference?: string;
        fallbackEmail?: string;
      };

      if (!response.ok || !data.ok) {
        // 503 + NO_INBOX means this deployment has no inbox wired up yet; the
        // form is still useful as a mail composer.
        if (response.status === 503) {
          openMailtoFallback();
          setStatus("success");
          setReference("MAILTO");
          setFeedback(
            data.message ?? "Opening your mail app — the message is ready to send.",
          );
          return;
        }
        setErrors(data.errors ?? {});
        setStatus("error");
        setFeedback(data.message ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setReference(data.reference ?? "");
      setFeedback(data.message ?? "Message received.");
      setForm(emptyForm);
      openedAt.current = Date.now();
    } catch {
      setStatus("error");
      setFeedback("Network error — please email me directly instead.");
    }
  };

  const update = (field: FieldName) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status === "error") setStatus("idle");
  };

  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative overflow-hidden border-t border-white/10">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-field absolute inset-0 opacity-25" />
        <div className="absolute -bottom-40 left-1/4 h-[520px] w-[520px] rounded-full bg-[rgba(var(--accent-rgb),0.1)] blur-[130px]" />
        <div className="noise-layer absolute inset-0" />
      </div>

      <div className="shell relative py-20 sm:py-24 lg:py-32">
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <span className="mono border border-line px-2.5 py-1.5 text-bone">07</span>
          <span className="mono text-accent">/ GET_IN_TOUCH</span>
          <span className="hidden h-px w-16 bg-line sm:block" aria-hidden />
          <span className="mono-sm ml-auto hidden items-center gap-2 text-[8px] text-fog sm:flex">
            <span className="status-dot" /> {profile.availability.toUpperCase()}
          </span>
        </div>

        <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h2 id="contact-heading" className="sr-only">
              Contact — let&apos;s build something extraordinary
            </h2>
            <div aria-hidden>
              <SplitLines
                lines={["LET'S", "BUILD"]}
                as="p"
                className="text-[clamp(2.6rem,9.4vw,8rem)]"
              />
              <SplitLines
                lines={["SOMETHING"]}
                as="p"
                delay={0.08}
                className="text-[clamp(3.2rem,11vw,9.5rem)] text-outline-accent"
              />
              <SplitLines
                lines={["EXTRAORDINARY."]}
                as="p"
                delay={0.16}
                className="text-[clamp(1.5rem,5.6vw,4.6rem)]"
              />
            </div>

            <Reveal delay={0.15} className="mt-8 max-w-[50ch]">
              <p className="body-copy text-sm">
                Have a product to build, a frontend that needs engineering discipline, or a role worth
                discussing? Send a note — clear briefs get the fastest replies.
              </p>
            </Reveal>

            <div className="mt-8 grid gap-px border border-white/10 bg-white/[0.06] sm:grid-cols-2">
              <a
                href={`mailto:${profile.email}`}
                className="group flex items-center justify-between gap-3 bg-ink/80 p-4 transition-colors hover:bg-elevated"
              >
                <div>
                  <p className="mono-sm text-[7px] text-fog">DIRECT EMAIL</p>
                  <p className="mt-1 font-display text-sm font-semibold text-bone transition-colors group-hover:text-accent">
                    {profile.email}
                  </p>
                </div>
                <Mail className="h-4 w-4 shrink-0 text-fog transition-colors group-hover:text-accent" />
              </a>
              <div className="flex items-center justify-between gap-3 bg-ink/80 p-4">
                <div>
                  <p className="mono-sm text-[7px] text-fog">BASED IN</p>
                  <p className="mt-1 font-display text-sm font-semibold text-bone">
                    {profile.location.toUpperCase()}
                  </p>
                </div>
                <MapPin className="h-4 w-4 shrink-0 text-fog" />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { href: profile.socials.github, label: "GITHUB", Icon: GithubIcon },
                { href: profile.socials.linkedin, label: "LINKEDIN", Icon: LinkedinIcon },
                { href: withBasePath(profile.resumePath), label: "RÉSUMÉ", Icon: ArrowUpRight },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("/") ? undefined : "_blank"}
                  rel="noreferrer noopener"
                  className="mono-sm inline-flex items-center gap-2 border border-white/12 px-3 py-2 text-[8px] text-ash transition-colors hover:border-accent/60 hover:text-accent"
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* form */}
          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <div className="glass-strong relative overflow-hidden p-5 sm:p-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <p className="mono-sm text-[8px] text-fog">TRANSMISSION FORM</p>
                  <span className="mono-sm flex items-center gap-1.5 text-[7px] text-lime">
                    <span className="h-1 w-1 bg-lime" /> CHANNEL OPEN
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  {status === "success" ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="py-12 text-center"
                      role="status"
                    >
                      <div className="mx-auto grid h-12 w-12 place-items-center border border-lime/50 bg-lime/10">
                        <Check className="h-5 w-5 text-lime" />
                      </div>
                      <p className="display-tight mt-5 text-2xl text-bone">MESSAGE RECEIVED.</p>
                      <p className="body-copy mx-auto mt-2 max-w-[34ch] text-sm">{feedback}</p>
                      {reference && (
                        <p className="mono-sm mt-4 inline-block border border-white/15 px-2 py-1 text-[8px] text-accent">
                          REF {reference}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setStatus("idle");
                          setFeedback("");
                          setReference("");
                          openedAt.current = Date.now();
                        }}
                        className="btn btn-ghost mt-7 w-full justify-center text-[9px]"
                      >
                        SEND ANOTHER MESSAGE
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={false}
                      onSubmit={handleSubmit}
                      noValidate
                      className="space-y-4 pt-4"
                    >
                      {/* Honeypot: hidden from people, irresistible to bots. */}
                      <div aria-hidden className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
                        <label htmlFor="contact-website">Leave this field empty</label>
                        <input
                          id="contact-website"
                          name="website"
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                          value={form.website}
                          onChange={update("website")}
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        {fields.map((field) => (
                          <div key={field.name} className={field.span}>
                            <label htmlFor={`contact-${field.name}`} className="mono-sm block text-[8px] text-fog">
                              {field.label} <span className="text-accent">*</span>
                            </label>
                            <input
                              id={`contact-${field.name}`}
                              name={field.name}
                              type={field.type}
                              autoComplete={field.autoComplete}
                              value={form[field.name]}
                              onChange={update(field.name)}
                              placeholder={field.placeholder}
                              aria-invalid={Boolean(errors[field.name])}
                              aria-describedby={errors[field.name] ? `error-${field.name}` : undefined}
                              required
                              className={cn(
                                "mt-1.5 w-full border-b bg-white/[0.02] px-2 py-2.5 font-sans text-[13px] text-bone placeholder:text-fog/50 transition-colors focus:border-accent focus:bg-white/[0.04] focus:outline-none",
                                errors[field.name] ? "border-red-400/70" : "border-white/15",
                              )}
                            />
                            {errors[field.name] && (
                              <p id={`error-${field.name}`} className="mt-1 font-mono text-[9px] text-red-300/90">
                                {errors[field.name]}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      <div>
                        <label htmlFor="contact-message" className="mono-sm block text-[8px] text-fog">
                          MESSAGE <span className="text-accent">*</span>
                        </label>
                        <textarea
                          id="contact-message"
                          name="message"
                          rows={5}
                          value={form.message}
                          onChange={update("message")}
                          placeholder="What are you building, and where does it need to go?"
                          aria-invalid={Boolean(errors.message)}
                          aria-describedby={errors.message ? "error-message" : undefined}
                          required
                          className={cn(
                            "mt-1.5 w-full resize-y border-b bg-white/[0.02] px-2 py-2.5 font-sans text-[13px] leading-relaxed text-bone placeholder:text-fog/50 transition-colors focus:border-accent focus:bg-white/[0.04] focus:outline-none",
                            errors.message ? "border-red-400/70" : "border-white/15",
                          )}
                        />
                        {errors.message && (
                          <p id="error-message" className="mt-1 font-mono text-[9px] text-red-300/90">
                            {errors.message}
                          </p>
                        )}
                      </div>

                      {status === "error" && feedback && (
                        <p role="alert" className="border border-red-400/30 bg-red-400/5 px-2.5 py-2 font-mono text-[9px] leading-relaxed text-red-200">
                          {feedback}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                        <p className="mono-sm max-w-[22ch] text-[7px] leading-relaxed text-fog">
                          VALIDATED + STORED IN POSTGRES. NO THIRD-PARTY TRACKING.
                        </p>
                        <button
                          type="submit"
                          disabled={status === "submitting"}
                          className="btn btn-primary justify-between text-[9px]"
                          data-cursor="send"
                        >
                          {status === "submitting" ? (
                            <>
                              SENDING
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            </>
                          ) : (
                            <>
                              SEND MESSAGE
                              <Send className="arrow h-3.5 w-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>

            <div className="mono-sm mt-3 flex items-center justify-between gap-2 text-[7px] text-fog">
              <span>CHANNEL / CONTACT_API_V1</span>
              <span className="flex items-center gap-1.5">
                RESPONSE TIME <span className="text-ash">&lt; 48H</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
