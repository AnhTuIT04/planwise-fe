import { IModalData } from "@/types/modal.type";
import { create } from "zustand";

type ModalType = keyof IModalData;
interface IModalState {
  type: ModalType;
  data: IModalData[ModalType];
  isOpen: boolean;
  isSubmitting: boolean;
  setData: <K extends ModalType>(payload: { data: IModalData[K] }) => void;
  onSubmit: () => Promise<void>;
  openModal: <K extends ModalType>(payload: { type: K; data: IModalData[K]; onSubmit?: () => Promise<void> }) => void;
  closeModal: () => void;
}

const useModalStore = create<IModalState>((set) => ({
  type: "",
  data: undefined,
  isOpen: false,
  isSubmitting: false,
  setData: ({ data }) => set((state) => ({ ...state, data })),
  onSubmit: async () => {},
  openModal: ({ type, data, onSubmit }) =>
    set({
      type,
      data,
      isOpen: true,
      onSubmit: async () => {
        if (!onSubmit) return;

        set({ isSubmitting: true });
        await onSubmit();
        set({ isSubmitting: false });
      },
    }),
  closeModal: () =>
    set({
      type: "",
      data: undefined,
      isOpen: false,
      onSubmit: async () => {},
    }),
}));

const useModal = <T extends keyof IModalData>() => {
  const { type, data, isOpen, isSubmitting, setData, onSubmit, openModal, closeModal } = useModalStore();
  const dataWithType = data as IModalData[T];
  const setDataWithType = setData<T>;
  const typeWithType = type as T;
  const openModalWithType = openModal<T>;

  return {
    type: typeWithType,
    data: dataWithType,
    isOpen,
    isSubmitting,
    setData: setDataWithType,
    onSubmit,
    openModal: openModalWithType,
    closeModal,
  };
};

export default useModal;
