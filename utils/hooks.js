import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import UserContext from '../contexts/user';

export function useChannel(channelName, callback) {
  const { ably } = useContext(UserContext);

  const channel = useMemo(() => ably && ably.channels.get(channelName), [ably, channelName]);

  useEffect(() => {
    channel.subscribe((msg) => {
      callback && callback(msg);
    });
    return () => channel.unsubscribe();
  }, [channel, callback]);

  return [channel, ably];
}

export function useChannels(channelNames, callback) {
  const { ably } = useContext(UserContext);

  const channels = useMemo(
    () => channelNames.map((channelName) => ably && ably.channels.get(channelName)),
    [ably, channelNames]
  );

  useEffect(() => {
    channels.map((channel) =>
      channel.subscribe((msg) => {
        callback && callback(msg);
      })
    );
    return () => channels.map((channel) => channel.unsubscribe());
  }, [channels, callback]);

  return [channels, ably];
}

export function usePresence(channelName, callback) {
  const { ably } = useContext(UserContext);

  const channel = useMemo(() => ably && ably.channels.get(channelName), [ably, channelName]);

  useEffect(() => {
    channel.presence.subscribe((msg) => {
      callback && callback(msg);
    });
    return () => channel.presence.unsubscribe();
  }, [channel.presence, callback]);

  return [channel.presence, ably];
}

export function usePresences(channelNames, callback) {
  const { ably } = useContext(UserContext);

  const channels = useMemo(
    () => channelNames.map((channelName) => ably && ably.channels.get(channelName)),
    [ably, channelNames]
  );
  const presences = channels.map((channel) => channel.presence);

  useEffect(() => {
    presences.map((presence) =>
      presence.subscribe((msg) => {
        callback && callback(msg);
      })
    );
    return () => presences.map((presence) => presence.unsubscribe());
  }, [presences, callback]);

  return [presences, ably];
}

export function useMergedState(initialState) {
  const [state, setState] = useState(initialState);
  const setMergedState = useCallback((newState) => {
    setState((prevState) => ({ ...prevState, ...(typeof newState === 'function' ? newState(prevState) : newState) }));
  }, []);
  return [state, setMergedState];
}
