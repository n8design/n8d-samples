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

// Blues color family from hTWOo
export const blueColorItems: ColorItem[] = [
    {
        msftName: "blueLight",
        msftNameLong: "Blue Light",
        colorValue: "var(--blueLight)",
        designToken: "300",
        SASSVariable: "$blue-300"
    },
    {
        msftName: "blue",
        msftNameLong: "Blue",
        colorValue: "var(--blue)",
        designToken: "600",
        SASSVariable: "$blue-600"
    },
    {
        msftName: "blueMid",
        msftNameLong: "Blue Mid",
        colorValue: "var(--blueMid)",
        designToken: "700",
        SASSVariable: "$blue-700"
    },
    {
        msftName: "blueDark",
        msftNameLong: "Blue Dark",
        colorValue: "var(--blueDark)",
        designToken: "800",
        SASSVariable: "$blue-800"
    }
];

// Greens color family from hTWOo
export const greenColorItems: ColorItem[] = [
    {
        msftName: "greenLight",
        msftNameLong: "Green Light",
        colorValue: "var(--greenLight)",
        designToken: "300",
        SASSVariable: "$green-300"
    },
    {
        msftName: "green",
        msftNameLong: "Green",
        colorValue: "var(--green)",
        designToken: "600",
        SASSVariable: "$green-600"
    },
    {
        msftName: "greenDark",
        msftNameLong: "Green Dark",
        colorValue: "var(--greenDark)",
        designToken: "800",
        SASSVariable: "$green-800"
    }
];

// Reds color family from hTWOo
export const redColorItems: ColorItem[] = [
    {
        msftName: "red",
        msftNameLong: "Red",
        colorValue: "var(--red)",
        designToken: "600",
        SASSVariable: "$red-600"
    },
    {
        msftName: "redDark",
        msftNameLong: "Red Dark",
        colorValue: "var(--redDark)",
        designToken: "800",
        SASSVariable: "$red-800"
    }
];

// Oranges color family from hTWOo
export const orangeColorItems: ColorItem[] = [
    {
        msftName: "orangeLighter",
        msftNameLong: "Orange Lighter",
        colorValue: "var(--orangeLighter)",
        designToken: "200",
        SASSVariable: "$orange-200"
    },
    {
        msftName: "orangeLight",
        msftNameLong: "Orange Light",
        colorValue: "var(--orangeLight)",
        designToken: "300",
        SASSVariable: "$orange-300"
    },
    {
        msftName: "orange",
        msftNameLong: "Orange",
        colorValue: "var(--orange)",
        designToken: "600",
        SASSVariable: "$orange-600"
    }
];

// Yellows color family from hTWOo
export const yellowColorItems: ColorItem[] = [
    {
        msftName: "yellowLight",
        msftNameLong: "Yellow Light",
        colorValue: "var(--yellowLight)",
        designToken: "300",
        SASSVariable: "$yellow-300"
    },
    {
        msftName: "yellow",
        msftNameLong: "Yellow",
        colorValue: "var(--yellow)",
        designToken: "600",
        SASSVariable: "$yellow-600"
    },
    {
        msftName: "yellowDark",
        msftNameLong: "Yellow Dark",
        colorValue: "var(--yellowDark)",
        designToken: "800",
        SASSVariable: "$yellow-800"
    }
];

// Teals color family from hTWOo
export const tealColorItems: ColorItem[] = [
    {
        msftName: "tealLight",
        msftNameLong: "Teal Light",
        colorValue: "var(--tealLight)",
        designToken: "300",
        SASSVariable: "$teal-300"
    },
    {
        msftName: "teal",
        msftNameLong: "Teal",
        colorValue: "var(--teal)",
        designToken: "600",
        SASSVariable: "$teal-600"
    },
    {
        msftName: "tealDark",
        msftNameLong: "Teal Dark",
        colorValue: "var(--tealDark)",
        designToken: "800",
        SASSVariable: "$teal-800"
    }
];

// Purples color family from hTWOo
export const purpleColorItems: ColorItem[] = [
    {
        msftName: "purpleLight",
        msftNameLong: "Purple Light",
        colorValue: "var(--purpleLight)",
        designToken: "300",
        SASSVariable: "$purple-300"
    },
    {
        msftName: "purple",
        msftNameLong: "Purple",
        colorValue: "var(--purple)",
        designToken: "600",
        SASSVariable: "$purple-600"
    },
    {
        msftName: "purpleDark",
        msftNameLong: "Purple Dark",
        colorValue: "var(--purpleDark)",
        designToken: "800",
        SASSVariable: "$purple-800"
    }
];

// Magentas color family from hTWOo
export const magentaColorItems: ColorItem[] = [
    {
        msftName: "magentaLight",
        msftNameLong: "Magenta Light",
        colorValue: "var(--magentaLight)",
        designToken: "300",
        SASSVariable: "$magenta-300"
    },
    {
        msftName: "magenta",
        msftNameLong: "Magenta",
        colorValue: "var(--magenta)",
        designToken: "600",
        SASSVariable: "$magenta-600"
    },
    {
        msftName: "magentaDark",
        msftNameLong: "Magenta Dark",
        colorValue: "var(--magentaDark)",
        designToken: "800",
        SASSVariable: "$magenta-800"
    }
];

// Primary Button Colors from hTWOo
export const buttonColorItems: ColorItem[] = [
    {
        msftName: "primaryButtonText",
        msftNameLong: "Primary Button Text",
        colorValue: "var(--primaryButtonText)",
        designToken: "neutral-000",
        SASSVariable: "$neutral-000"
    },
    {
        msftName: "primaryButtonTextHovered",
        msftNameLong: "Primary Button Text Hovered",
        colorValue: "var(--primaryButtonTextHovered)",
        designToken: "neutral-000",
        SASSVariable: "$neutral-000"
    },
    {
        msftName: "primaryButtonTextPressed",
        msftNameLong: "Primary Button Text Pressed",
        colorValue: "var(--primaryButtonTextPressed)",
        designToken: "neutral-000",
        SASSVariable: "$neutral-000"
    },
    {
        msftName: "primaryButtonBackgroundDisabled",
        msftNameLong: "Primary Button Background Disabled",
        colorValue: "var(--primaryButtonBackgroundDisabled)",
        designToken: "neutral-100",
        SASSVariable: "$neutral-100"
    },
    {
        msftName: "primaryButtonTextDisabled",
        msftNameLong: "Primary Button Text Disabled",
        colorValue: "var(--primaryButtonTextDisabled)",
        designToken: "neutral-300",
        SASSVariable: "$neutral-300"
    },
    {
        msftName: "primaryButtonBackground",
        msftNameLong: "Primary Button Background",
        colorValue: "var(--primaryButtonBackground)",
        designToken: "theme-600",
        SASSVariable: "$theme-600"
    },
    {
        msftName: "primaryButtonBackgroundHovered",
        msftNameLong: "Primary Button Background Hovered",
        colorValue: "var(--primaryButtonBackgroundHovered)",
        designToken: "theme-700",
        SASSVariable: "$theme-700"
    },
    {
        msftName: "primaryButtonBackgroundPressed",
        msftNameLong: "Primary Button Background Pressed",
        colorValue: "var(--primaryButtonBackgroundPressed)",
        designToken: "theme-800",
        SASSVariable: "$theme-800"
    },
    {
        msftName: "primaryButtonBorder",
        msftNameLong: "Primary Button Border",
        colorValue: "transparent",
        designToken: "transparent",
        SASSVariable: ""
    }
];

export default {
    neutralColorItems,
    themeColorItems,
    blueColorItems,
    greenColorItems,
    redColorItems,
    orangeColorItems,
    yellowColorItems,
    tealColorItems,
    purpleColorItems,
    magentaColorItems,
    buttonColorItems
};