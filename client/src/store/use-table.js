import { create } from "zustand";
import dayjs from "dayjs";

const useTableStore = create((set, get) => {
  const initialState = {
    selectedTable: null,
    tableId: null,
    isLoading: false,
    searchInitiated: false,
    date: dayjs(),
    partySize: 2,
    startTime: dayjs().hour(12).minute(0),
    endTime: dayjs().hour(23).minute(0),
    availableTables: [],
    isLoaded: false,
    error: null,
    price: 0
  };

  return {
    ...initialState,
    setDate: (date) => set({ date }),
    setPartySize: (partySize) => set({ partySize }),
    setStartTime: (startTime) => set({ startTime }),
    setEndTime: (endTime) => set({ endTime }),
    setAvailableTables: (availableTables) => set({ availableTables }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setIsLoaded: (isLoaded) => set({ isLoaded }),
    setError: (error) => set({ error }),
    setSearchInitiated: (searchInitiated) => set({ searchInitiated }),
    setTableId: (tableId) => set({ tableId }),
    setSelectedTable: (selectedTable) => set({ selectedTable }),
    getPrice: () => {
      const durationInHours = dayjs(get().endTime).diff(
        dayjs(get().startTime),
        "hour",
        true
      );
      const roundedHours = Math.ceil(durationInHours);
      return roundedHours * 100;
    }
  };
});

export default useTableStore;
