import {
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import {
  updateReceiverLocation,
  stopLocationSharing,
} from "../services/api";

function LocationSharing(props) {
  const request = props.request;
  const [sharing, setSharing] =
    useState(
      request.isLocationShared || false
    );
  const intervalReference =
    useRef(null);

  function sendLocation() {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        try {
          await updateReceiverLocation(
            request._id,
            {
              latitude:
                position.coords.latitude,
              longitude:
                position.coords.longitude,
            }
          );
        } catch (error) {
          toast.error(
            error.response?.data?.message ||
              "Could not update location"
          );
        }
      },
      function (error) {
        toast.error(
          "Location error: " +
            error.message
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }

  function startSharing() {
    if (!navigator.geolocation) {
      toast.error(
        "Location is not supported by this device"
      );
      return;
    }

    clearInterval(
      intervalReference.current
    );
    sendLocation();
    intervalReference.current =
      setInterval(sendLocation, 30000);
    setSharing(true);
    toast.success(
      "Location sharing started"
    );
  }

  async function stopSharing() {
    clearInterval(
      intervalReference.current
    );
    intervalReference.current = null;

    try {
      await stopLocationSharing(
        request._id
      );
      setSharing(false);
      toast.success(
        "Location sharing stopped"
      );
    } catch (error) {
      toast.error(
        "Could not stop location sharing"
      );
    }
  }

  useEffect(function () {
    if (request.isLocationShared) {
      sendLocation();
      intervalReference.current =
        setInterval(sendLocation, 30000);
    }

    return function () {
      clearInterval(
        intervalReference.current
      );
    };
  }, []);

  return sharing ? (
    <button
      className="btn btn-danger btn-sm"
      onClick={stopSharing}
    >
      Stop Location Sharing
    </button>
  ) : (
    <button
      className="btn btn-primary btn-sm"
      onClick={startSharing}
    >
      Start Location Sharing
    </button>
  );
}

export default LocationSharing;
