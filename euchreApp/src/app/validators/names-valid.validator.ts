import { AbstractControl, ValidationErrors } from '@angular/forms';

export const NamesValid = (control: AbstractControl): ValidationErrors | null => {
  const playersControls = [ // Grab the controls dynamically
    control.get('player0'),
    control.get('player1'),
    control.get('player2'),
    control.get('player3')
  ];

  // Check if any two players have the same value
  const values = playersControls.map(ctrl => ctrl?.value);
  const uniqueValues = new Set(values); // We got this line from ChatGPT

  if (uniqueValues.size === values.length) {
    return null; // All player names are unique; no validation error
  }

  return { namesUnique: false }; // Names are not unique; validation error
};
