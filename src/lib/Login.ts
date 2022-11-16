import { AuthProvider, StoredToken } from "../constants/settings";
import {
  createEmbeddedWalletLink,
  EMBEDDED_WALLET_IFRAME_ID,
  IframeCommunicator,
} from "../utils/IframeCommunicator";

export type LoginTypes = {
  jwtAuth: {
    token: string;
    provider: AuthProvider;
  };
  emailAuth: {};
};

export class Login {
  protected clientId: string;
  protected walletManagerQuerier: IframeCommunicator<LoginTypes>;

  constructor({ clientId }: { clientId: string }) {
    this.clientId = clientId;

    this.walletManagerQuerier = new IframeCommunicator({
      iframeId: EMBEDDED_WALLET_IFRAME_ID,
      link: createEmbeddedWalletLink({ clientId }).href,
    });
  }

  async jwtAuth({
    token,
    provider,
  }: {
    token: string;
    provider: AuthProvider;
  }): Promise<{ success: boolean }> {
    try {
      console.log("calling jwtAuth in SDK");
      await this.walletManagerQuerier.init();
      console.log("complete walletManagerQuerier in SDK");
      console.log("token in SDK is ", token);
      console.log("provider in SDK is ", provider);
      const response = await this.walletManagerQuerier.call<StoredToken>(
        "jwtAuth",
        {
          token,
          provider,
        }
      );

      if (response.jwtToken) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (e) {
      console.error("Error trying to call jwtAuth in SDK");
      console.error(e);
      return { success: false };
    }
  }
}
