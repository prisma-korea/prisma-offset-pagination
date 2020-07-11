enum ErrorString {
  CursorOrCurrentPageArgNotGivenTogether =
  'Cursor and CurrentPage argument should be given together.',
}

export const ErrorCursorOrCurrentPageArgNotGivenTogether =
  (): Error => new Error(
    ErrorString.CursorOrCurrentPageArgNotGivenTogether,
  );
