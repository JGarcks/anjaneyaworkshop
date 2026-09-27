# look_map.py — draws a flat map of a whole planet, lit like a relief map, from what Planet's viewer is sent.
# In:  a folder holding grid.bin (GET /api/grid) and elevation_m.bin, lake_depth_m.bin, drainage_km2.bin, area_km2.bin
#      (GET /api/field/<name>); the picture's width in pixels; how many cells of land upstream make a river worth drawing.
# Out: one PNG, the whole planet in latitude and longitude, the same colours and the same light for every planet.
# Decision: standard library only and no browser, so any machine draws the same picture of the same planet (W12).
# Built in W12 — Planet's meta review (27 Sep 2026), as a reference for Planet's `planet look` (its session FS-2).
#
# Fetch a planet's numbers first, from any engine that is serving (it only reads):
#   for f in elevation_m lake_depth_m drainage_km2 area_km2; do curl -s -o $f.bin http://HOST:PORT/api/field/$f; done
#   curl -s -o grid.bin http://HOST:PORT/api/grid
# Then:  python look_map.py FOLDER out.png 1600 60
import array
import math
import os
import struct
import sys
import zlib

SEA = [(-7000, (8, 16, 52)), (-5000, (12, 28, 84)), (-3000, (20, 52, 124)), (-1000, (36, 88, 162)),
       (-200, (64, 132, 198)), (0, (104, 170, 222))]
LAND = [(0, (74, 128, 72)), (150, (104, 152, 80)), (400, (150, 172, 96)), (800, (196, 186, 118)),
        (1500, (188, 150, 100)), (2500, (152, 108, 82)), (3500, (124, 90, 80)), (4500, (240, 240, 240))]
LAKE = (128, 192, 236)
RIVER = (44, 96, 204)


def load_grid(path):
    """The grid as the engine sends it: PGRD, a version, the cell count, then each cell's place on the unit
    sphere (three f32), its neighbour count (u32) and six neighbour ids (u32)."""
    raw = open(path, "rb").read()
    assert raw[:4] == b"PGRD", "not a grid from /api/grid"
    _, cells = struct.unpack_from("<II", raw, 4)
    at = 12
    place = array.array("f")
    place.frombytes(raw[at:at + cells * 12])
    at += cells * 12
    count = array.array("I")
    count.frombytes(raw[at:at + cells * 4])
    at += cells * 4
    neighbours = array.array("I")
    neighbours.frombytes(raw[at:at + cells * 24])
    return cells, place, count, neighbours


def load_field(folder, name, cells):
    values = array.array("f")
    values.frombytes(open(os.path.join(folder, name + ".bin"), "rb").read())
    assert len(values) == cells, name + " is not from the same planet as the grid"
    return values


def cell_under_each_pixel(place, count, neighbours, width, height):
    """The nearest cell to every pixel. Walks the neighbour table from the last pixel's cell toward the pixel's
    own place until no neighbour is nearer: on this grid that always ends at the nearest cell."""
    under = array.array("I", bytes(4 * width * height))
    row_start = 0
    for y in range(height):
        latitude = math.pi * (0.5 - (y + 0.5) / height)
        cos_lat, sin_lat = math.cos(latitude), math.sin(latitude)
        cell = row_start
        for x in range(width):
            longitude = 2 * math.pi * ((x + 0.5) / width) - math.pi
            tx, ty, tz = cos_lat * math.cos(longitude), sin_lat, cos_lat * math.sin(longitude)  # the pole is y
            best = place[3 * cell] * tx + place[3 * cell + 1] * ty + place[3 * cell + 2] * tz
            moved = True
            while moved:
                moved = False
                nearer = -1
                for k in range(count[cell]):
                    n = neighbours[6 * cell + k]
                    d = place[3 * n] * tx + place[3 * n + 1] * ty + place[3 * n + 2] * tz
                    if d > best:
                        best, nearer = d, n
                if nearer >= 0:
                    cell, moved = nearer, True
            under[y * width + x] = cell
            if x == 0:
                row_start = cell
    return under


def colour_on(stops, value):
    if value <= stops[0][0]:
        return stops[0][1]
    for (v0, c0), (v1, c1) in zip(stops, stops[1:]):
        if value <= v1:
            t = (value - v0) / (v1 - v0)
            return tuple(c0[i] + (c1[i] - c0[i]) * t for i in range(3))
    return stops[-1][1]


def light_on_each_cell(cells, place, count, neighbours, height_m, cell_km):
    """How brightly each land cell is lit from the north-west of the map: brighter where the ground falls away
    to the south-east. Kept gentle (0.84 to 1.14) so the colours still say the height."""
    light = [1.0] * cells
    for c in range(cells):
        px, py, pz = place[3 * c], place[3 * c + 1], place[3 * c + 2]
        east = (pz, 0.0, -px)
        length = math.hypot(east[0], east[2]) or 1.0
        east = (east[0] / length, 0.0, east[2] / length)
        north = (-py * px, 1 - py * py, -py * pz)
        length = math.sqrt(sum(v * v for v in north)) or 1.0
        north = tuple(v / length for v in north)
        here = max(height_m[c], 0.0)
        rise_east = rise_north = 0.0
        for k in range(count[c]):
            n = neighbours[6 * c + k]
            step = (place[3 * n] - px, place[3 * n + 1] - py, place[3 * n + 2] - pz)
            rise = max(height_m[n], 0.0) - here
            rise_east += rise * (step[0] * east[0] + step[2] * east[2])
            rise_north += rise * sum(step[i] * north[i] for i in range(3))
        slope = (rise_east - rise_north) / (cell_km * 1000.0) * 6371.0 * 9.0
        light[c] = max(0.84, min(1.14, 1.0 - slope))
    return light


def write_png(path, width, height, rgb):
    def chunk(tag, data):
        body = tag + data
        return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body) & 0xFFFFFFFF)
    rows = bytearray()
    for y in range(height):
        rows.append(0)
        rows += rgb[y * width * 3:(y + 1) * width * 3]
    with open(path, "wb") as out:
        out.write(b"\x89PNG\r\n\x1a\n")
        out.write(chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)))
        out.write(chunk(b"IDAT", zlib.compress(bytes(rows), 9)))
        out.write(chunk(b"IEND", b""))


def main(folder, out, width, river_from_cells):
    height = width // 2
    cells, place, count, neighbours = load_grid(os.path.join(folder, "grid.bin"))
    height_m = load_field(folder, "elevation_m", cells)
    lake = load_field(folder, "lake_depth_m", cells)
    upstream = load_field(folder, "drainage_km2", cells)
    area = load_field(folder, "area_km2", cells)
    mean_area = sum(area) / cells
    light = light_on_each_cell(cells, place, count, neighbours, height_m, math.sqrt(mean_area))
    river_from = river_from_cells * mean_area
    colours = []
    for c in range(cells):
        if height_m[c] <= 0:
            colour = colour_on(SEA, height_m[c])
        elif lake[c] > 0:
            colour = LAKE
        elif upstream[c] >= river_from:
            colour = RIVER
        else:
            colour = tuple(v * light[c] for v in colour_on(LAND, height_m[c]))
        colours.append(tuple(max(0, min(255, int(v))) for v in colour))
    under = cell_under_each_pixel(place, count, neighbours, width, height)
    rgb = bytearray(width * height * 3)
    for i in range(width * height):
        rgb[3 * i:3 * i + 3] = bytes(colours[under[i]])
    write_png(out, width, height, rgb)
    print("wrote", out, width, "x", height, "from", cells, "cells")


if __name__ == "__main__":
    if len(sys.argv) != 5:
        sys.exit("Usage: python look_map.py FOLDER OUT.png WIDTH RIVER_FROM_CELLS")
    main(sys.argv[1], sys.argv[2], int(sys.argv[3]), float(sys.argv[4]))
