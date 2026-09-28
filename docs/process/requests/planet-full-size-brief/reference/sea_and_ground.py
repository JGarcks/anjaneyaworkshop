# sea_and_ground.py — reads a planet's own log and says how the sea and the ground far inland moved over its life.
# In:  one or more log.json files, as `planet look --seed` writes beside its pictures (a reading every 10 million years).
# Out: a plain table per planet: the sea's level, the continents' rock, and how far the inland ground stands above the sea.
# Decision: standard library only and read only, so Planet can run it or not; every figure comes from the log as written.
# Built in W14 — Planet's FS-5 review (28 Sep 2026). Use: python3 sea_and_ground.py ~/planet-looks/fs4/after/seed-*/log.json
import json
import statistics
import sys

PLANET_KM2 = 510.06e6  # the whole surface at Earth's radius, 6,371 km


def rock_bn_km3(reading):
    """The continents' rock: their share of the planet, times its area, times their mean thickness."""
    return reading["continent_share"] * PLANET_KM2 * reading["mean_continent_thickness_km"] / 1e9


def trend_m_per_billion_years(readings):
    """A straight line fitted through the sea's level against the planet's age."""
    xs = [r["year"] / 1e9 for r in readings]
    ys = [r["sea_level_m"] for r in readings]
    mx, my = sum(xs) / len(xs), sum(ys) / len(ys)
    return sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / sum((x - mx) ** 2 for x in xs)


def report(path):
    with open(path, encoding="utf-8") as f:
        log = json.load(f)
    first, last = log[0], log[-1]
    years = (last["year"] - first["year"]) or 1.0
    settled = [r for r in log if r["year"] >= 100e6]  # the first 100 million years are the planet settling
    step_years = log[1]["year"] - log[0]["year"]
    window = max(1, round(100e6 / step_years))  # readings in 100 million years
    swings = [log[i + window]["sea_level_m"] - log[i]["sea_level_m"]
              for i in range(len(log) - window) if log[i]["year"] >= 200e6]
    margin = [r["land_far_inland_m"] for r in settled if r.get("land_far_inland_m") is not None]

    print(path)
    print("  readings %d, to %.0f million years" % (len(log), last["year"] / 1e6))
    print("  the sea's level, fixed scale      %6.0f m -> %6.0f m (%+.0f m)"
          % (first["sea_level_m"], last["sea_level_m"], last["sea_level_m"] - first["sea_level_m"]))
    if len(settled) > 2:
        print("  the sea's trend from 100 Myr      %6.0f m a billion years" % trend_m_per_billion_years(settled))
    if swings:
        print("  biggest rise and fall in 100 Myr  %+6.0f m and %+.0f m" % (max(swings), min(swings)))
    print("  continent, share of the planet    %6.1f %% -> %5.1f %%"
          % (100 * first["continent_share"], 100 * last["continent_share"]))
    print("  continent, mean thickness         %6.2f km -> %5.2f km"
          % (first["mean_continent_thickness_km"], last["mean_continent_thickness_km"]))
    print("  the continents' rock              %6.2f -> %5.2f billion km3 (x %.2f), net %.2f km3 a year"
          % (rock_bn_km3(first), rock_bn_km3(last), rock_bn_km3(last) / rock_bn_km3(first),
             (rock_bn_km3(last) - rock_bn_km3(first)) * 1e9 / years))
    if margin:
        print("  ground over 1,000 km inland, above the sea: least %.0f m, usual %.0f m, most %.0f m"
              % (min(margin), statistics.median(margin), max(margin)))
    print()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("use: python3 sea_and_ground.py LOG.json [LOG.json ...]")
    for log_path in sys.argv[1:]:
        report(log_path)
