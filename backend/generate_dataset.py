"""
CyberShield AI - Normal Employee Activity Dataset Generator
============================================================
Generates 3,000 realistic synthetic records representing normal
employee computer activity for training the Isolation Forest
anomaly detection model.
"""

import numpy as np
import pandas as pd
import os

# ── Fixed seed for reproducibility ──────────────────────────────────
np.random.seed(42)
NUM_ROWS = 3000

# ── 1. login_hour (0-23) ───────────────────────────────────────────
# Core working hours 9-11 (majority), 8-19 (common), rare early/late
login_hour = np.concatenate([
    np.random.choice([9, 10, 11], size=int(NUM_ROWS * 0.45)),          # Peak 9-11
    np.random.randint(8, 20, size=int(NUM_ROWS * 0.40)),               # Broad 8-19
    np.random.choice([6, 7, 20, 21], size=int(NUM_ROWS * 0.10)),       # Early / late
    np.random.choice([0, 1, 2, 3, 4, 5, 22, 23], size=int(NUM_ROWS * 0.05)),  # Very rare
])
np.random.shuffle(login_hour)

# ── 2. failed_logins ───────────────────────────────────────────────
# Mostly 0, sometimes 1, rarely 2
failed_logins = np.random.choice(
    [0, 1, 2],
    size=NUM_ROWS,
    p=[0.85, 0.12, 0.03]
)

# ── 3. known_device (1 = yes, 0 = no) ─────────────────────────────
# Mostly 1, occasionally 0
known_device = np.random.choice(
    [1, 0],
    size=NUM_ROWS,
    p=[0.92, 0.08]
)

# ── 4. download_mb (20-800, most below 500) ───────────────────────
# Log-normal distribution shifted to create realistic right-skew
raw_downloads = np.random.lognormal(mean=5.2, sigma=0.6, size=NUM_ROWS)
download_mb = np.clip(raw_downloads, 20, 800).round(2)

# ── 5. sensitive_file_access (0 or 1) ─────────────────────────────
# Mostly 0, sometimes 1 for authorized employees
sensitive_file_access = np.random.choice(
    [0, 1],
    size=NUM_ROWS,
    p=[0.82, 0.18]
)

# ── 6. antivirus_active (almost always 1) ─────────────────────────
antivirus_active = np.random.choice(
    [1, 0],
    size=NUM_ROWS,
    p=[0.97, 0.03]
)

# ── Build DataFrame ────────────────────────────────────────────────
df = pd.DataFrame({
    "login_hour": login_hour.astype(int),
    "failed_logins": failed_logins.astype(int),
    "known_device": known_device.astype(int),
    "download_mb": download_mb,
    "sensitive_file_access": sensitive_file_access.astype(int),
    "antivirus_active": antivirus_active.astype(int),
})

# ── Save CSV ────────────────────────────────────────────────────────
output_dir = os.path.join(os.path.dirname(__file__), "app", "data")
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, "normal_activity.csv")
df.to_csv(output_path, index=False)

# ═══════════════════════════════════════════════════════════════════
#  VALIDATION & REPORTING
# ═══════════════════════════════════════════════════════════════════

print("=" * 65)
print("  CyberShield AI — Dataset Generation Report")
print("=" * 65)

# ── Check row count ─────────────────────────────────────────────────
row_count, col_count = df.shape
print(f"\n✅ Rows generated  : {row_count}")
print(f"✅ Columns         : {col_count}")
assert row_count == 3000, f"❌ Expected 3000 rows, got {row_count}"
print("   ✔ Row count verified (3,000)")

# ── Check columns ───────────────────────────────────────────────────
expected_cols = [
    "login_hour", "failed_logins", "known_device",
    "download_mb", "sensitive_file_access", "antivirus_active"
]
assert list(df.columns) == expected_cols, "❌ Column mismatch"
print("   ✔ All 6 required columns present")

# ── Missing values ──────────────────────────────────────────────────
missing = df.isnull().sum().sum()
print(f"\n✅ Missing values  : {missing}")
assert missing == 0, "❌ Found missing values"
print("   ✔ No missing values")

# ── Duplicate rows ──────────────────────────────────────────────────
dupes = df.duplicated().sum()
print(f"\n✅ Duplicate rows  : {dupes}")
if dupes == 0:
    print("   ✔ No duplicate rows")
else:
    print(f"   ⚠ {dupes} duplicate rows found (acceptable in random data)")

# ── Range checks ────────────────────────────────────────────────────
print("\n── Range Validation ──────────────────────────────────")
checks_passed = True

def check_range(col, lo, hi):
    global checks_passed
    cmin, cmax = df[col].min(), df[col].max()
    ok = cmin >= lo and cmax <= hi
    status = "✔" if ok else "❌"
    print(f"   {status} {col:25s}  min={cmin:<8}  max={cmax:<8}  expected [{lo}, {hi}]")
    if not ok:
        checks_passed = False

check_range("login_hour", 0, 23)
check_range("failed_logins", 0, 2)
check_range("known_device", 0, 1)
check_range("download_mb", 20, 800)
check_range("sensitive_file_access", 0, 1)
check_range("antivirus_active", 0, 1)

# ── First 10 rows ──────────────────────────────────────────────────
print("\n── First 10 Rows ─────────────────────────────────────")
print(df.head(10).to_string(index=False))

# ── Basic statistics ────────────────────────────────────────────────
print("\n── Column Statistics ──────────────────────────────────")
print(df.describe().round(2).to_string())

# ── Binary column value counts ──────────────────────────────────────
binary_cols = ["known_device", "sensitive_file_access", "antivirus_active"]
print("\n── Binary Column Distributions ───────────────────────")
for col in binary_cols:
    counts = df[col].value_counts().sort_index()
    print(f"\n   {col}:")
    for val, cnt in counts.items():
        label = "Yes" if val == 1 else "No"
        pct = cnt / NUM_ROWS * 100
        print(f"     {val} ({label:3s}) → {cnt:>5} records  ({pct:.1f}%)")

# Also show failed_logins distribution
print(f"\n   failed_logins:")
for val, cnt in df["failed_logins"].value_counts().sort_index().items():
    pct = cnt / NUM_ROWS * 100
    print(f"     {val}       → {cnt:>5} records  ({pct:.1f}%)")

# ── Column explanations ────────────────────────────────────────────
print("\n── Column Explanations ───────────────────────────────")
explanations = {
    "login_hour":
        "The hour of the day (0-23) when the employee logged in.\n"
        "     Normal employees mostly log in between 8 AM and 7 PM,\n"
        "     with a peak during 9-11 AM.",
    "failed_logins":
        "Number of failed login attempts before a successful login.\n"
        "     Normal employees rarely fail; mostly 0, sometimes 1.",
    "known_device":
        "Whether the login came from a recognized/registered device.\n"
        "     1 = known device, 0 = unknown device.",
    "download_mb":
        "Amount of data downloaded in megabytes during the session.\n"
        "     Normal employees download between 20-800 MB, mostly under 500 MB.",
    "sensitive_file_access":
        "Whether the employee accessed sensitive/classified files.\n"
        "     1 = yes, 0 = no. Some authorized employees do access them.",
    "antivirus_active":
        "Whether antivirus software was active on the device.\n"
        "     1 = active, 0 = inactive. Almost always active for normal use.",
}
for col, desc in explanations.items():
    print(f"\n   {col}:\n     {desc}")

# ── Final summary ──────────────────────────────────────────────────
print("\n" + "=" * 65)
print("  FINAL SUMMARY")
print("=" * 65)
print(f"  File saved to    : {os.path.abspath(output_path)}")
print(f"  Rows             : {row_count}")
print(f"  Columns          : {col_count}")
print(f"  Missing values   : {missing}")
print(f"  Duplicate rows   : {dupes}")
print(f"  Min values       : {df.min().to_dict()}")
print(f"  Max values       : {df.max().to_dict()}")
all_ok = checks_passed and missing == 0 and row_count == 3000 and col_count == 6
print(f"\n  All checks passed: {'✅ YES' if all_ok else '❌ NO'}")
print("=" * 65)
