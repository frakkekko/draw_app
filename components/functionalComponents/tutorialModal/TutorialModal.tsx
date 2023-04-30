import React, {
  FunctionComponent,
  LegacyRef,
  MutableRefObject,
  useRef,
} from "react";
import { View, Text, Modal, Image } from "react-native";

// Tutorial Swiper
import Onboarding, { Page } from "react-native-onboarding-swiper";

// Images
import AlbumImg from "../../../assets/imgs/tutorial/album.png";
import DrawImg from "../../../assets/imgs/tutorial/draw.png";
import saveImg from "../../../assets/imgs/tutorial/save.png";
import DrawPenImg from "../../../assets/imgs/tutorial/drawPen.png";

type TutorialModalProps = {
  handleTutorialDone: () => any;
  isShown: boolean;
};

const TutorialModal: FunctionComponent<TutorialModalProps> = (
  props: TutorialModalProps
) => {
  let onBoardingRef = useRef<any>();
  let indexPageRef = useRef<number>(0);

  const tutorialSlides: Page[] = [
    {
      title: "Welcome",
      subtitle: "Welcome to Draw App",
      backgroundColor: "#222",
      image: <Image source={DrawImg} style={{ width: 256, height: 256 }} />,
    },
    {
      title: "Draw",
      subtitle: "Draw what you want",
      backgroundColor: "#222",
      image: <Image source={DrawPenImg} style={{ width: 256, height: 256 }} />,
    },
    {
      title: "Create Albums for save your drawings",
      subtitle: "You can create albums and save all your drawings in the app",
      backgroundColor: "#222",
      image: <Image source={AlbumImg} style={{ width: 256, height: 256 }} />,
    },
    {
      title: "Save Safety",
      subtitle:
        "All drawings you save in the app it will automatically save in media library also!",
      backgroundColor: "#222",
      image: <Image source={saveImg} style={{ width: 256, height: 256 }} />,
    },
  ];

  const handleButtons = (pageIndex: number) => {
    console.log("Page Index:", pageIndex);
    indexPageRef.current = pageIndex;

    if (pageIndex === 0 || null) {
      onBoardingRef.current.props.showSkip = false;
    } else {
      onBoardingRef.current.props.showSkip = true;
    }
  };

  function goToPreviousPage() {
    indexPageRef.current = indexPageRef.current - 1;
    onBoardingRef.current.goToPage(indexPageRef.current, true);
  }
  return (
    <Modal visible={props.isShown} animationType="slide">
      <Onboarding
        ref={onBoardingRef}
        onDone={props.handleTutorialDone}
        pages={tutorialSlides}
        nextLabel={"Next"}
        showSkip={false}
        skipLabel={"Go Back"}
        pageIndexCallback={handleButtons}
        onSkip={goToPreviousPage}
      />
    </Modal>
  );
};

export default TutorialModal;
