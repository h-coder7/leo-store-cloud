export const PRODUCT_SIZES = [
    '1 شهر', '3 شهور', '6 شهور', '9 شهور', '12 شهر', '18 شهر', '24 شهر',
    'سنتين', '3 سنوات', '4 سنوات', '5 سنوات', '6 سنوات',
    '7 سنوات', '8 سنوات', '9 سنوات', '10 سنوات', '12 سنة',
    '14 سنة', '16 سنة', '18 سنة', '20 سنة',
] as const;

export type ColorSizesMap = Record<string, string[]>;

/** Derive colors/sizes arrays stored on the product from per-color size map. */
export function deriveProductVariants(color_sizes: ColorSizesMap | null) {
    if (!color_sizes || Object.keys(color_sizes).length === 0) {
        return { colors: [] as string[], sizes: [] as string[], color_sizes: null };
    }

    const colors = Object.keys(color_sizes);
    const explicitSizes = new Set<string>();
    let hasUniversalColor = false;

    for (const sizes of Object.values(color_sizes)) {
        if (!sizes || sizes.length === 0) {
            hasUniversalColor = true;
        } else {
            sizes.forEach((s) => explicitSizes.add(s));
        }
    }

    const sizes = hasUniversalColor
        ? [...new Set([...PRODUCT_SIZES, ...explicitSizes])]
        : Array.from(explicitSizes);

    return { colors, sizes, color_sizes };
}

/** Empty array for a color means all product sizes are available. */
export function isSizeAvailableForColor(
    color: string,
    size: string,
    colorSizes: ColorSizesMap,
    productSizes: string[],
) {
    const forColor = colorSizes[color];
    if (!forColor || forColor.length === 0) {
        return productSizes.includes(size);
    }
    return forColor.includes(size);
}
