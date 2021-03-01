import React, { useRef, useState } from "react";
import { Button, Hidden, Menu, MenuItem, Paper } from "@material-ui/core";
import { ExpandMore, Translate } from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from "material-ui-popup-state/hooks";

export enum AvailableLanguages {
  English = "en",
  Dutch = "nl",
}

export default function LanguageSelector() {
  const { t, i18n } = useTranslation();

  const menuState = usePopupState({
    variant: "popover",
    popupId: "languageMenu",
  });

  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);

  const handleItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const incomingSelection = event.currentTarget.getAttribute("data-language");
    if (
      incomingSelection &&
      Object.values(AvailableLanguages).includes(
        incomingSelection as AvailableLanguages
      )
    ) {
      // get language-in-array check working
      i18n.changeLanguage(incomingSelection);
    }

    menuState.close();
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef?.current?.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <div>
      <Button
        color="inherit"
        endIcon={<ExpandMore />}
        startIcon={<Translate />}
        {...bindTrigger(menuState)}
      >
        <Hidden xsDown>Language</Hidden>
      </Button>
      <Paper>
        <Menu {...bindMenu(menuState)}>
          {Object.entries(AvailableLanguages).map((value, index) => {
            return (
              <MenuItem
                onClick={handleItemClick}
                data-language={value[1]}
                key={`language-selector-${index}`}
              >
                {t(`availableLanguageLabels.${value[1]}`)}
              </MenuItem>
            );
          })}
        </Menu>
      </Paper>
    </div>
  );
}
