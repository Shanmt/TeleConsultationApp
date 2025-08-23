export type RootStackParamList = {
  Registration: undefined;
  Login: undefined;
  Dashboard: undefined;
  BookAppointment: undefined;
  BookingDetails: { bookingId: string };
  ContactUs: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Registration: undefined;
};

export type MainStackParamList = {
  Dashboard: undefined;
  BookAppointment: undefined;
  BookingDetails: { bookingId: string };
  ContactUs: undefined;
  Profile: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  BookAppointment: undefined;
  Profile: undefined;
};
