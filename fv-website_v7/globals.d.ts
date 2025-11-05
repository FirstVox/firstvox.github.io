// This file provides TypeScript definitions for the Google Identity Services (GSI)
// client library, which is loaded from a <script> tag in index.html.

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: CredentialResponse) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme: 'outline' | 'filled_blue' | 'filled_black';
              size: 'large' | 'medium' | 'small';
              type: 'standard' | 'icon';
              text: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              width?: string;
            }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export interface CredentialResponse {
  credential?: string;
  select_by?:
    | 'auto'
    | 'user'
    | 'user_1tap'
    | 'user_2tap'
    | 'btn'
    | 'btn_confirm'
    | 'btn_add_session'
    | 'btn_confirm_add_session';
  clientId?: string;
}
