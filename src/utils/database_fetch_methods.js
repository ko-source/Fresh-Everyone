import firebase from "../config/fbconfig";

export const getProvider = async (providerId) => {
  const provider = await firebase
    .firestore()
    .collection("providers")
    .doc(providerId)
    .get();

  if (provider) {
    return {
      ...provider.data(),
      id: provider.id,
    };
  } else {
    return {
      id: providerId,
      phone: providerId,
    };
  }
};

export const getUser = async (userId) => {
  const user = await firebase.firestore().collection("users").doc(userId).get();

  if (user.data()) {
    return {
      ...user.data(),
      id: user.id,
    };
  } else {
    return {
      id: userId,
      phone: userId,
    };
  }
};

export const getOrder = async (orderId) => {
  const resolvedOrder = await firebase
    .firestore()
    .collection("orders")
    .doc(orderId)
    .get();
  // const resolverProvider = (await getProvider(resolvedOrder.data().provider_id));
  // console.log(resolvedOrder.data())
  return {
    ...resolvedOrder.data(),
    // order_ticketId: resolvedOrder.data().ticketId,
    // order_timestamp: resolvedOrder.data().timestamp,
    // order_status: resolvedOrder.data().status,
    // order_time: resolvedOrder.data().time,
    // order_id: orderId,
    // order_provider: resolverProvider,
    // order_provider_name: resolverProvider.name,
    // order_service: resolvedOrder.data().service,
  };
};

export const getService = async (serviceId, subServiceId) => {
  const [resolvedService, resolvedSubService] = await Promise.all([
    firebase.firestore().collection("services").doc(serviceId).get(),
    firebase
      .firestore()
      .collection("services")
      .doc(`${serviceId}/subservices/${subServiceId}`)
      .get(),
  ]);

  return {
    service: { ...resolvedService.data(), id: serviceId },
    sub_service: { ...resolvedSubService.data(), id: subServiceId },
  };
};

export const getReferral = async (customerId) => {
  try {
    const user = await firebase
      .firestore()
      .collection("users")
      .doc(customerId)
      .get();
    if (user.data()?.referralCode) {
      return await firebase
        .firestore()
        .collection("users")
        .doc(user.data().referralCode)
        .get()
        .then((referral) => {
          if (referral?.data()?.name) {
            return referral?.data()?.name;
          } else {
            return referral?.data()?.phone;
          }
        });
    } else {
      return "";
    }
  } catch (e) {
    console.log(e);
  }
};
