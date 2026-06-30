"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, type FormEvent, useMemo, useState } from "react";

type UserRole = "buyer" | "seller";

const mockTradeLink = "/trade/tr-000001";

const steps = [
  "Marketplace link",
  "Item details",
  "Your role",
  "Preview",
  "Mock link"
];

function getInitialRole(role: string | null): UserRole {
  return role === "seller" ? "seller" : "buyer";
}

function CreateTradeWizard() {
  const searchParams = useSearchParams();
  const sourceParam = searchParams.get("source");
  const urlParam = searchParams.get("url");
  const titleParam = searchParams.get("title");
  const roleParam = searchParams.get("role");
  const hasPrefilledData = Boolean(
    sourceParam || urlParam || titleParam || roleParam
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [marketplaceSource, setMarketplaceSource] = useState(sourceParam ?? "");
  const [marketplaceLink, setMarketplaceLink] = useState(urlParam ?? "");
  const [itemTitle, setItemTitle] = useState(titleParam ?? "");
  const [itemSummary, setItemSummary] = useState("");
  const [userRole, setUserRole] = useState<UserRole>(getInitialRole(roleParam));
  const [generatedLink, setGeneratedLink] = useState("");

  const previewItems = useMemo(
    () => [
      {
        label: "Trade Status",
        value: "Created"
      },
      {
        label: "Marketplace Source",
        value: marketplaceSource || "Marketplace source not specified"
      },
      {
        label: "Marketplace Reference",
        value: marketplaceLink || "External listing reference pending"
      },
      {
        label: "Item Title",
        value: itemTitle || "Untitled trade item"
      },
      {
        label: "Short Summary",
        value: itemSummary || "No summary entered"
      },
      {
        label: "Your Role",
        value: userRole === "buyer" ? "Buyer" : "Seller"
      }
    ],
    [itemSummary, itemTitle, marketplaceLink, marketplaceSource, userRole]
  );

  function goNext() {
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  }

  function goBack() {
    setCurrentStep((step) => Math.max(step - 1, 0));
  }

  function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGeneratedLink(mockTradeLink);
    setCurrentStep(4);
  }

  return (
    <main className="profile-page create-trade-page">
      <section className="trade-header" aria-labelledby="create-trade-heading">
        <p className="eyebrow">Create Trade</p>
        <h1 id="create-trade-heading">Start a Trade History</h1>
        <p className="wizard-intro">
          TrustLayer references an external marketplace listing and records the
          beginning of a trade history. The marketplace still hosts the listing,
          and payment stays outside TrustLayer.
        </p>
      </section>

      {hasPrefilledData && (
        <aside className="prefill-notice" aria-label="Pre-filled data notice">
          <h2>Pre-filled information</h2>
          <p>
            Some information was provided by the link. TrustLayer has not
            verified the marketplace listing. Please review and confirm the
            information before creating a TrustLayer trade record.
          </p>
          <p>Pre-filled data is only a convenience feature.</p>
        </aside>
      )}

      <ol className="wizard-steps" aria-label="Create trade progress">
        {steps.map((step, index) => (
          <li
            className={index === currentStep ? "active" : ""}
            key={step}
            aria-current={index === currentStep ? "step" : undefined}
          >
            <span>{index + 1}</span>
            {step}
          </li>
        ))}
      </ol>

      <form className="wizard-panel" onSubmit={handleGenerate}>
        {currentStep === 0 && (
          <section aria-labelledby="marketplace-link-heading">
            <h2 id="marketplace-link-heading">External Marketplace Link</h2>
            <label htmlFor="marketplace-source">Marketplace source</label>
            <input
              id="marketplace-source"
              type="text"
              value={marketplaceSource}
              onChange={(event) => setMarketplaceSource(event.target.value)}
              placeholder="facebook"
            />
            <label htmlFor="marketplace-link">Listing URL or reference</label>
            <input
              id="marketplace-link"
              type="url"
              value={marketplaceLink}
              onChange={(event) => setMarketplaceLink(event.target.value)}
              placeholder="https://example.com/listing/123"
            />
            <p>
              TrustLayer does not host marketplace listings or scrape external
              pages.
            </p>
          </section>
        )}

        {currentStep === 1 && (
          <section aria-labelledby="item-details-heading">
            <h2 id="item-details-heading">Item Title / Short Summary</h2>
            <label htmlFor="item-title">Item title</label>
            <input
              id="item-title"
              type="text"
              value={itemTitle}
              onChange={(event) => setItemTitle(event.target.value)}
              placeholder="iPhone 14"
            />
            <label htmlFor="item-summary">Short summary</label>
            <textarea
              id="item-summary"
              value={itemSummary}
              onChange={(event) => setItemSummary(event.target.value)}
              placeholder="Used phone, agreed from external listing"
              rows={4}
            />
          </section>
        )}

        {currentStep === 2 && (
          <section aria-labelledby="role-heading">
            <h2 id="role-heading">User Role</h2>
            <fieldset className="role-options">
              <legend>Select your role in this trade</legend>
              <label>
                <input
                  checked={userRole === "buyer"}
                  name="user-role"
                  onChange={() => setUserRole("buyer")}
                  type="radio"
                />
                Buyer
              </label>
              <label>
                <input
                  checked={userRole === "seller"}
                  name="user-role"
                  onChange={() => setUserRole("seller")}
                  type="radio"
                />
                Seller
              </label>
            </fieldset>
          </section>
        )}

        {currentStep === 3 && (
          <section aria-labelledby="preview-heading">
            <h2 id="preview-heading">Preview Trade Record</h2>
            <dl className="preview-list">
              {previewItems.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
            <p>
              This preview starts a mock Trade Created record. Future actions
              create the history.
            </p>
          </section>
        )}

        {currentStep === 4 && (
          <section aria-labelledby="generated-link-heading">
            <h2 id="generated-link-heading">Mock TrustLayer Trade Link</h2>
            <div className="generated-link">
              <span>{generatedLink || mockTradeLink}</span>
              <Link href={generatedLink || mockTradeLink}>Open Trade Record</Link>
            </div>
            <p>
              Users create reputation history through recorded actions.
              TrustLayer does not process payment or decide trust.
            </p>
          </section>
        )}

        <div className="wizard-actions">
          <button disabled={currentStep === 0} onClick={goBack} type="button">
            Back
          </button>
          {currentStep < 3 && (
            <button onClick={goNext} type="button">
              Next
            </button>
          )}
          {currentStep === 3 && <button type="submit">Generate Mock Link</button>}
          {currentStep === 4 && (
            <button
              onClick={() => {
                setGeneratedLink("");
                setCurrentStep(0);
              }}
              type="button"
            >
              Start Again
            </button>
          )}
        </div>
      </form>
    </main>
  );
}

export default function CreateTradePage() {
  return (
    <Suspense fallback={null}>
      <CreateTradeWizard />
    </Suspense>
  );
}
