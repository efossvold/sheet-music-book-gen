// @ts-expect-error
namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
    I_LOVE_PDF_API_PUBLIC: string;
    I_LOVE_PDF_API_SECRET_KEY: string;
    ASSETS_DIR: string;
    TEMPLATES_DIR: string;
    SCORES_DIR: string;
    TMP_DIR: string;
  }
}
