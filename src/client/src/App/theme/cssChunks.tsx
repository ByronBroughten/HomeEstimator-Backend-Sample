import { css } from "styled-components";
import { nativeTheme } from "./nativeTheme";
import theme, { ThemeName } from "./Theme";

function mainColorSection(themeName: ThemeName) {
  return css`
    background: ${theme[themeName].main};
    border: 1px solid ${theme.transparentGrayDark};
  `;
}

const ccs = {
  mainColorSection,
  neutralColorSection: css`
    background-color: ${theme.transparentGray};
    border: 1px solid ${theme.transparentGrayBorder};
  `,
  coloring: {
    section: {
      lightNeutral: css`
        background-color: ${theme.transparentGray};
        border: 1px solid ${theme.transparentGrayBorder};
      `,
      darkNeutral: css`
        background-color: ${theme["gray-600"]};
        border: 1px solid ${theme.transparentGrayLight};
      `,
    },
    button: {
      lightNeutral(active: boolean) {
        return css`
          color: ${theme.dark};
          background-color: ${theme["gray-300"]};
          border: 1px solid ${theme.transparentGrayBorder};
          ${active &&
          css`
            ${ccs.coloring.section.darkNeutral};
            color: ${theme.light};
            :hover,
            :focus {
              ${ccs.coloring.section.darkNeutral};
              color: ${theme.light};
            }
          `}
        `;
      },
      varbSelector: css`
        background-color: ${theme.next.dark};
        color: ${theme.light};
        :hover,
        :focus {
          background-color: ${theme.next.main};
          color: ${theme.dark};
        }
      `,
    },
  },
  padding: {
    sides: (size: string) =>
      css`
        padding-left: ${size};
        padding-right: ${size};
      `,
  },
  size: (size: string) =>
    css`
      height: ${size};
      width: ${size};
    `,
  shape: {
    button: {
      smallCurved: css`
        width: ${theme.unlabeledInputHeight};
        height: ${theme.unlabeledInputHeight};
        border-radius: ${theme.br0};
      `,
    },
  },
  flex: {
    titleRow: css`
      display: flex;
      justify-content: space-between;
    `,
  },
  smallScrollBar: css`
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background-color: ${theme["gray-300"]};
    }
    ::-webkit-scrollbar-thumb {
      background-color: ${theme["gray-500"]};
      border: 1px solid ${theme["gray-300"]};
    }
  `,
  dropdown: {
    scrollbar: css`
      ::-webkit-scrollbar {
        width: 8px;
      }
      ::-webkit-scrollbar-track {
        background-color: ${theme["gray-300"]};
      }
      ::-webkit-scrollbar-thumb {
        background-color: ${theme["gray-500"]};
        border: 1px solid ${theme["gray-300"]};
      }
    `,
  },
  xPlusBtnBody: css`
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: none;
    :hover {
      box-shadow: none;
    }
  `,
  materialDraftEditor: {
    root: css`
      padding: ${theme.s1} ${theme.s2} 0 ${theme.s2};
      border-radius: ${theme.br0};
    `,
    main({ label }: { label?: string }) {
      return css`
        display: inline-block;
        .MaterialDraftEditor-wrapper {
          display: inline-block;
          border-top-left-radius: ${theme.br0};
          border-top-right-radius: ${theme.br0};
          border: 1px solid ${theme.primaryBorder};
          /* border-bottom: 1px solid transparent; */
          background-color: ${theme.light};
        }

        .MuiFilledInput-adornedStart {
          padding-left: 0;
        }
        .MuiFilledInput-adornedEnd {
          padding-right: 0;
        }

        .MuiInputBase-root {
          ${this.root};
          display: inline-block;
          white-space: nowrap;
          background: ${theme.light};
        }

        .DraftEditor-root {
          display: inline-block;
        }
        .DraftEditor-editorContainer {
        }

        .public-DraftEditor-content {
          display: inline-block;
          white-space: nowrap;
          color: ${theme.dark};
        }

        .public-DraftStyleDefault-block {
          display: flex;
          flex-wrap: nowrap;
          white-space: nowrap;
        }

        ${label &&
        css`
          .MuiFilledInput-root {
            padding-left: ${theme.s2};
            padding-right: ${theme.s2};
            padding-top: 1.2rem;
            padding-bottom: 2px;
            /* min-width: 75px; */
          }

          .MuiFormLabel-root {
            color: ${theme["gray-600"]};
            white-space: nowrap;
          }
          .MuiFormLabel-root.Mui-focused {
            color: ${nativeTheme.primary.main};
          }

          // label location without text
          .MuiInputLabel-filled {
            transform: translate(${theme.s2}, 17px) scale(1);
          }
          // label location while shrunk
          .MuiInputLabel-filled.MuiInputLabel-shrink {
            transform: translate(${theme.s2}, ${theme.s2}) scale(0.85);
          }
        `}
      `;
    },
  },
} as const;

export default ccs;
