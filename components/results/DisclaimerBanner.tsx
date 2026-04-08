interface Props {
  counselorNote?: string;
}

export default function DisclaimerBanner({ counselorNote }: Props) {
  return (
    <div className="bg-surface-container-low border-l-4 border-secondary rounded-xl p-6">
      <div className="flex gap-4">
        <div className="bg-secondary-container/30 p-2 rounded-lg h-fit flex-shrink-0">
          <span
            className="material-symbols-outlined text-secondary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            info
          </span>
        </div>
        <div className="space-y-3">
          <div>
            <p className="font-headline font-bold text-on-surface text-sm mb-1">
              Advisory tool — not a guarantee
            </p>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Salary ranges are estimates based on Bureau of Labor Statistics data
              for the Jackson, MS area (May 2024). Actual income depends on
              employer, experience, negotiation, and economic conditions. Program
              costs and availability change — verify directly with institutions
              before enrolling.
            </p>
          </div>

          {counselorNote && (
            <div>
              <p className="font-semibold text-sm text-on-surface mb-2">
                A note from your advisor:
              </p>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {counselorNote}
              </p>
            </div>
          )}

          <div>
            <p className="font-semibold text-sm text-on-surface mb-2">
              Free counselor resources:
            </p>
            <ul className="space-y-1 text-sm text-on-surface-variant">
              <li>
                Hinds CC Career Services:{" "}
                <span className="font-medium text-on-surface">(601) 857-3200</span>
              </li>
              <li>
                MDES:{" "}
                <span className="font-medium text-on-surface">(601) 321-6000</span>
              </li>
              <li>
                Mississippi Works Job Centers:{" "}
                <span className="font-medium text-on-surface">(888) 844-3577</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
