import analytics from '@react-native-firebase/analytics';

export const logScreenView = async (screenName: string, screenClass?: string) => {
  await analytics().logScreenView({
    screen_name: screenName,
    screen_class: screenClass || screenName,
  });
};

export const logEvent = async (eventName: string, params?: { [key: string]: any }) => {
  await analytics().logEvent(eventName, params);
};

export const setUserId = async (userId: string | null) => {
  await analytics().setUserId(userId);
};

export const setUserProperties = async (properties: { [key: string]: string | null }) => {
  await analytics().setUserProperties(properties);
};

export const logLogin = async (method: string) => {
  await analytics().logLogin({
    method,
  });
};

export const logSignUp = async (method: string) => {
  await analytics().logSignUp({
    method,
  });
};
