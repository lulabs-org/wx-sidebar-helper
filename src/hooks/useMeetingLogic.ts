import { useState, useRef, type ChangeEvent, type KeyboardEvent } from "react";
import { buildMeetingNotice } from "../meetingNotice";
import { parseMeetingPaste, type MeetingFormState } from "../utils/meetingParser";

export function useMeetingLogic() {
  const [meetingForm, setMeetingForm] = useState<MeetingFormState>({
    link1: "",
    id1: "",
    topic1: "",
    link2: "",
    id2: "",
    topic2: "",
  });
  const [meetingPaste, setMeetingPaste] = useState<string>("");
  const [meetingResponse, setMeetingResponse] = useState<string>("");
  const [meetingLoading, setMeetingLoading] = useState<boolean>(false);
  const [meetingError, setMeetingError] = useState<string>("");
  const meetingBuildTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildMeetingNoticeFromForm = (form: MeetingFormState, silent = false): void => {
    const link1 = form.link1.trim();
    const id1 = form.id1.trim();
    const topic1 = form.topic1.trim();
    const link2 = form.link2.trim();
    const id2 = form.id2.trim();
    const topic2 = form.topic2.trim();

    if (!link1 || !id1 || !link2 || !id2) {
      if (!silent) {
        setMeetingError("请填写完整的会议链接与会议号");
      } else {
        setMeetingError("");
      }
      setMeetingResponse("");
      return;
    }

    setMeetingResponse(buildMeetingNotice({ link1, id1, topic1, link2, id2, topic2 }));
    setMeetingError("");
    setMeetingLoading(false);
  };

  const queueMeetingBuild = (form: MeetingFormState): void => {
    if (meetingBuildTimerRef.current) {
      clearTimeout(meetingBuildTimerRef.current);
    }
    meetingBuildTimerRef.current = setTimeout(() => {
      meetingBuildTimerRef.current = null;
      buildMeetingNoticeFromForm(form, true);
    }, 400);
  };

  const updateMeetingForm =
    (field: keyof MeetingFormState) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setMeetingForm((prev) => {
        const next = { ...prev, [field]: value };
        queueMeetingBuild(next);
        return next;
      });
      setMeetingError("");
    };

  const handleMeetingPaste = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMeetingPaste(value);
    const parsed = parseMeetingPaste(value);
    if (parsed) {
      setMeetingForm(parsed);
      queueMeetingBuild(parsed);
      setMeetingError("");
    }
  };

  const handleMeetingFieldKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      buildMeetingNoticeFromForm(meetingForm, false);
    }
  };

  return {
    meetingForm,
    meetingPaste,
    meetingResponse,
    meetingLoading,
    meetingError,
    updateMeetingForm,
    handleMeetingPaste,
    handleMeetingFieldKeyDown,
  };
}
