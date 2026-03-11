"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { ArrowLeftIcon } from "lucide-react";
import { getSettingsAction, saveSettingsAction } from "@/app/actions/settings";

const SCALE_OPTIONS = ["< 1k", "1k–100k", "> 100k"] as const;
const EXPERTISE_OPTIONS = ["low", "medium", "high"] as const;
const BUDGET_OPTIONS = ["minimal", "moderate", "enterprise"] as const;
const PROVIDER_OPTIONS = ["AWS", "Azure", "GCP"] as const;
const COMPLIANCE_OPTIONS = [
  "HIPAA",
  "SOC 2",
  "PCI DSS",
  "GDPR",
  "FedRAMP",
  "ISO 27001",
] as const;

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [scale, setScale] = useState<string>("< 1k");
  const [cloudExpertise, setCloudExpertise] = useState<string>("low");
  const [budget, setBudget] = useState<string>("minimal");
  const [compliance, setCompliance] = useState<string[]>([]);
  const [providers, setProviders] = useState<string[]>([]);

  useEffect(() => {
    getSettingsAction().then((settings) => {
      if (settings) {
        setScale(settings.scale);
        setCloudExpertise(settings.cloudExpertise);
        setBudget(settings.budget);
        setCompliance(settings.compliance ?? []);
        setProviders(settings.providers ?? []);
      }
      setLoading(false);
    });
  }, []);

  function toggleItem(
    list: string[],
    setList: (v: string[]) => void,
    item: string,
  ) {
    setList(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item],
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await saveSettingsAction({
      scale,
      cloudExpertise,
      budget,
      compliance,
      providers,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-2xl px-6 py-8">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back
        </button>

        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure your cloud environment preferences. These are used to tailor
          architecture recommendations.
        </p>

        <Separator className="my-6" />

        <form onSubmit={handleSave}>
          <FieldGroup>
            {/* Scale */}
            <Field>
              <FieldLabel>Scale (Users)</FieldLabel>
              <FieldDescription>
                Expected number of users for your workload.
              </FieldDescription>
              <Select value={scale} onValueChange={(v) => v && setScale(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select scale" />
                </SelectTrigger>
                <SelectContent>
                  {SCALE_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Cloud Expertise */}
            <Field>
              <FieldLabel>Cloud Expertise</FieldLabel>
              <FieldDescription>
                Your team&apos;s level of cloud infrastructure experience.
              </FieldDescription>
              <Select value={cloudExpertise} onValueChange={(v) => v && setCloudExpertise(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select expertise" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERTISE_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Budget */}
            <Field>
              <FieldLabel>Budget</FieldLabel>
              <FieldDescription>
                Budget range for cloud infrastructure spend.
              </FieldDescription>
              <Select value={budget} onValueChange={(v) => v && setBudget(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Compliance */}
            <Field>
              <FieldLabel>Compliance Requirements</FieldLabel>
              <FieldDescription>
                Select all compliance frameworks that apply.
              </FieldDescription>
              <div className="flex flex-wrap gap-x-6 gap-y-3 pt-1">
                {COMPLIANCE_OPTIONS.map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <Checkbox
                      checked={compliance.includes(opt)}
                      onCheckedChange={() =>
                        toggleItem(compliance, setCompliance, opt)
                      }
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </Field>

            {/* Providers */}
            <Field>
              <FieldLabel>Cloud Providers</FieldLabel>
              <FieldDescription>
                Select which cloud providers you want to consider.
              </FieldDescription>
              <div className="flex flex-wrap gap-x-6 gap-y-3 pt-1">
                {PROVIDER_OPTIONS.map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <Checkbox
                      checked={providers.includes(opt)}
                      onCheckedChange={() =>
                        toggleItem(providers, setProviders, opt)
                      }
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </Field>

            <Separator className="my-2" />

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={saving}>
                {saving && <Spinner data-icon="inline-start" />}
                Save Settings
              </Button>
              {saved && (
                <span className="text-sm text-muted-foreground">
                  Settings saved.
                </span>
              )}
            </div>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
