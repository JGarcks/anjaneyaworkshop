# look_numbers.py — measures where a planet's land and its high ground lie, by distance from the open sea.
# In:  a folder holding grid.bin (GET /api/grid) and elevation_m.bin, area_km2.bin, plate.bin (GET /api/field/<name>).
# Out: a printed page: land by distance from the open sea with its mean height, the share of land and of high
#      ground within 500 km of the sea, the spread of land's heights, the plates by size; `--json` for a chart.
# Decision: the open sea is the largest joined-up body of sea cells, so a sea cut off inside a continent is not a coast (W12).
# Built in W12 — Planet's meta review (27 Sep 2026), as a reference for the numbers beside `planet look` (its session FS-2).
#
# Fetch the planet's numbers as look_map.py's note says (plate.bin as well), then:  python look_numbers.py FOLDER
import array
import json
import math
import os
import struct
import sys
from collections import deque

HIGH_GROUND_M = 1000.0
NEAR_THE_SEA_KM = 500.0


def load(folder):
    raw = open(os.path.join(folder, "grid.bin"), "rb").read()
    assert raw[:4] == b"PGRD", "not a grid from /api/grid"
    _, cells = struct.unpack_from("<II", raw, 4)
    at = 12 + cells * 12
    count = array.array("I")
    count.frombytes(raw[at:at + cells * 4])
    at += cells * 4
    neighbours = array.array("I")
    neighbours.frombytes(raw[at:at + cells * 24])

    def field(name):
        values = array.array("f")
        values.frombytes(open(os.path.join(folder, name + ".bin"), "rb").read())
        assert len(values) == cells, name + " is not from the same planet as the grid"
        return values
    return cells, count, neighbours, field("elevation_m"), field("area_km2"), field("plate")


def steps_from_the_open_sea(cells, count, neighbours, height_m, area):
    """For every cell, how many cells it is from the open sea (0 in it). The open sea is the largest joined-up
    body of cells at or below the sea."""
    sea = [height_m[c] <= 0 for c in range(cells)]
    body = [-1] * cells
    sizes = []
    for start in range(cells):
        if sea[start] and body[start] < 0:
            body[start] = len(sizes)
            queue = deque([start])
            size = 0.0
            while queue:
                c = queue.popleft()
                size += area[c]
                for k in range(count[c]):
                    n = neighbours[6 * c + k]
                    if sea[n] and body[n] < 0:
                        body[n] = body[start]
                        queue.append(n)
            sizes.append(size)
    ocean = max(range(len(sizes)), key=lambda b: sizes[b])
    steps = [-1] * cells
    queue = deque()
    for c in range(cells):
        if sea[c] and body[c] == ocean:
            steps[c] = 0
            queue.append(c)
    while queue:
        c = queue.popleft()
        for k in range(count[c]):
            n = neighbours[6 * c + k]
            if steps[n] < 0:
                steps[n] = steps[c] + 1
                queue.append(n)
    cut_off = sum(size for b, size in enumerate(sizes) if b != ocean)
    return sea, steps, sizes[ocean], cut_off


def main(folder, as_json):
    cells, count, neighbours, height_m, area, plate = load(folder)
    planet = sum(area)
    # Hexagons of this area stand this far apart, centre to centre.
    cell_km = math.sqrt(planet / cells * 2 / math.sqrt(3))
    sea, steps, ocean, cut_off = steps_from_the_open_sea(cells, count, neighbours, height_m, area)
    land = [c for c in range(cells) if not sea[c]]
    land_area = sum(area[c] for c in land)
    high_area = sum(area[c] for c in land if height_m[c] > HIGH_GROUND_M)
    km = lambda c: (steps[c] - 0.5) * cell_km
    rings = []
    within = 0.0
    for step in range(1, max(steps[c] for c in land) + 1):
        ring = [c for c in land if steps[c] == step]
        if not ring:
            continue
        ring_area = sum(area[c] for c in ring)
        within += ring_area
        rings.append({"km": round((step - 0.5) * cell_km),
                      "mean_m": round(sum(area[c] * height_m[c] for c in ring) / ring_area),
                      "land_within_pct": round(100 * within / land_area, 1)})
    heights = sorted(height_m[c] for c in land)
    at = lambda share: round(heights[int(share * (len(heights) - 1))])
    plates = {}
    for c in range(cells):
        plates[int(plate[c])] = plates.get(int(plate[c]), 0.0) + area[c]
    page = {
        "cells": cells,
        "cell_km": round(cell_km, 1),
        "land_pct": round(100 * land_area / planet, 1),
        "open_sea_pct": round(100 * ocean / planet, 1),
        "sea_cut_off_pct": round(100 * cut_off / planet, 2),
        "land_within_500_km_pct": round(100 * sum(area[c] for c in land if km(c) <= NEAR_THE_SEA_KM) / land_area, 1),
        "high_ground_within_500_km_pct": round(
            100 * sum(area[c] for c in land if height_m[c] > HIGH_GROUND_M and km(c) <= NEAR_THE_SEA_KM)
            / max(high_area, 1e-9), 1),
        "farthest_land_km": rings[-1]["km"],
        "land_height_m": {"a tenth below": at(0.1), "half below": at(0.5), "nine tenths below": at(0.9),
                          "highest": round(heights[-1])},
        "plates_on_top": len(plates),
        "plates_over_1_pct": sum(1 for a in plates.values() if a >= 0.01 * planet),
        "plates_under_0.1_pct": sum(1 for a in plates.values() if a < 0.001 * planet),
        "rings": rings,
    }
    if as_json:
        print(json.dumps(page))
        return
    for name, value in page.items():
        if name != "rings":
            print("%-32s %s" % (name, value))
    print("\n  km from the open sea   mean height   land within")
    for ring in rings:
        print("  %8d               %6d m      %5.1f%%" % (ring["km"], ring["mean_m"], ring["land_within_pct"]))


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("Usage: python look_numbers.py FOLDER [--json]")
    main(sys.argv[1], "--json" in sys.argv[2:])
