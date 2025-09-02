export interface ColorItem {
    msftName: string;
    msftNameLong: string;
    colorValue: string;
    designToken: string;
    SASSVariable: string;
}

export const neutralColorItems: ColorItem[] = [
    {
        msftName: "White",
        msftNameLong: "White",
        colorValue: "var(--white)",
        designToken: "0",
        SASSVariable: "$neutral-000"
    },
    {
        msftName: "neutralLighterAlt",
        msftNameLong: "Neutral Lighter Alt",
        colorValue: "var(--neutralLighterAlt)",
        designToken: "50",
        SASSVariable: "$neutral-050"
    },
    {
        msftName: "neutralLighter",
        msftNameLong: "Neutral Lighter",
        colorValue: "var(--neutralLighter)",
        designToken: "100",
        SASSVariable: "$neutral-100"
    },
    {
        msftName: "neutralLight",
        msftNameLong: "Neutral Light",
        colorValue: "var(--neutralLight)",
        designToken: "200",
        SASSVariable: "$neutral-200"
    },
    {
        msftName: "neutralQuaternaryAlt",
        msftNameLong: "Neutral Quaternary Alt",
        colorValue: "var(--neutralQuaternaryAlt)",
        designToken: "250",
        SASSVariable: "$neutral-250"
    },
    {
        msftName: "neutralQuaternary",
        msftNameLong: "Neutral Quaternary",
        colorValue: "var(--neutralQuaternary)",
        designToken: "300",
        SASSVariable: "$neutral-300"
    },
    {
        msftName: "neutralTertiaryAlt",
        msftNameLong: "Neutral Tertiary Alt",
        colorValue: "var(--neutralTertiaryAlt)",
        designToken: "350",
        SASSVariable: "$neutral-350"
    },
    {
        msftName: "neutralTertiary",
        msftNameLong: "Neutral Tertiary",
        colorValue: "var(--neutralTertiary)",
        designToken: "400",
        SASSVariable: "$neutral-400"
    },
    {
        msftName: "neutralSecondaryAlt",
        msftNameLong: "Neutral Secondary Alt",
        colorValue: "var(--neutralSecondaryAlt)",
        designToken: "450",
        SASSVariable: "$neutral-450"
    },
    {
        msftName: "neutralSecondary",
        msftNameLong: "Neutral Secondary",
        colorValue: "var(--neutralSecondary)",
        designToken: "500",
        SASSVariable: "$neutral-500"
    },
    {
        msftName: "neutralPrimaryAlt",
        msftNameLong: "Neutral Primary Alt",
        colorValue: "var(--neutralPrimaryAlt)",
        designToken: "600",
        SASSVariable: "$neutral-600"
    },
    {
        msftName: "neutralPrimary",
        msftNameLong: "Neutral Primary",
        colorValue: "var(--neutralPrimary)",
        designToken: "700",
        SASSVariable: "$neutral-700"
    },
    {
        msftName: "neutralDark",
        msftNameLong: "Neutral Dark",
        colorValue: "var(--neutralDark)",
        designToken: "800",
        SASSVariable: "$neutral-800"
    },
    {
        msftName: "Black",
        msftNameLong: "Black",
        colorValue: "var(--black)",
        designToken: "900",
        SASSVariable: "$neutral-900"
    }
];

// Predefined theme color items
export const themeColorItems: ColorItem[] = [
    {
        msftName: "themeLighterAlt",
        msftNameLong: "Theme Lighter Alt",
        colorValue: "var(--themeLighterAlt)",
        designToken: "100",
        SASSVariable: "$theme-100"
    },
    {
        msftName: "themeLighter",
        msftNameLong: "Theme Lighter",
        colorValue: "var(--themeLighter)",
        designToken: "200",
        SASSVariable: "$theme-200"
    },
    {
        msftName: "themeLight",
        msftNameLong: "Theme Light",
        colorValue: "var(--themeLight)",
        designToken: "300",
        SASSVariable: "$theme-300"
    },
    {
        msftName: "themeTertiary",
        msftNameLong: "Theme Tertiary",
        colorValue: "var(--themeTertiary)",
        designToken: "400",
        SASSVariable: "$theme-400"
    },
    {
        msftName: "themeSecondary",
        msftNameLong: "Theme Secondary",
        colorValue: "var(--themeSecondary)",
        designToken: "500",
        SASSVariable: "$theme-500"
    },
    {
        msftName: "themePrimary",
        msftNameLong: "Theme Primary",
        colorValue: "var(--themePrimary)",
        designToken: "600",
        SASSVariable: "$theme-600"
    },
    {
        msftName: "themeDarkAlt",
        msftNameLong: "Theme Dark Alt",
        colorValue: "var(--themeDarkAlt)",
        designToken: "700",
        SASSVariable: "$theme-700"
    },
    {
        msftName: "themeDark",
        msftNameLong: "Theme Dark",
        colorValue: "var(--themeDark)",
        designToken: "800",
        SASSVariable: "$theme-800"
    },
    {
        msftName: "themeDarker",
        msftNameLong: "Theme Darker",
        colorValue: "var(--themeDarker)",
        designToken: "900",
        SASSVariable: "$theme-900"
    }
];

export default {
    neutralColorItems,
    themeColorItems
};