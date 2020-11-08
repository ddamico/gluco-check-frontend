import React from "react";

type TokenSetupProps = {};

export default function TokenSetup({}: TokenSetupProps) {
  return (
    <>
      <p>
        Some features of Gluco-Check (list them) require a token from your
        Nightscout site. Here's how you get one!
      </p>
      <ol>
        <li>
          1) Make sure your site is on (minimum version) of Nightscout. You can
          check the version by clicking on the hamburger menu... ...and then
          scrolling down to the about box.
        </li>
        <li>
          2) If you need an upgrade, you can read more about how to do that
          [here](http://www.nightscout.info/wiki/welcome/how-to-update-to-latest-cgm-remote-monitor-aka-cookie).
          If you do not need an upgrade... let's goooooo!
        </li>
        <li>3) Click on the hamburger menu... (image)</li>
        <li>4) Click on "Admin Tools" (image) </li>
        <li>
          5) Click on "Add new Role", populate the Role with the values pictured
          below, and click save.
        </li>
        <li>
          6) Click on "Add new Subject", populate the Subject with the values
          pictured below, and click save.
        </li>
        <li>
          7) Copy the value in the "Access Token" column, paste it into the
          Nightscout Token field in [Gluco-Check Settings](url to that), and
          click save.
        </li>
      </ol>
    </>
  );
}
