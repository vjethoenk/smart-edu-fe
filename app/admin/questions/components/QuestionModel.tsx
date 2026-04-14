import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Plus,
  Check,
  Trash2,
  AlertCircle,
  MessageSquareCheck,
} from "lucide-react";
import { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  useApproveQuestion,
  useCreateQuestion,
  useUpdateQuestion,
} from "@/features/question/hook";
import { IQuestion } from "@/types/api";
import { ApprovalStatus } from "@/features/course/enum";

interface IProps {
  isOpenQuestionModel: boolean;
  setIsOpenQuestionModel: (v: boolean) => void;
  mode?: "create" | "view" | "edit";
  initialData?: IQuestion | null;
}

const QuestionModel = (props: IProps) => {
  const { mutate: createQuestion } = useCreateQuestion();
  const { mutate: updateQuestion } = useUpdateQuestion();
  const {
    setIsOpenQuestionModel,
    isOpenQuestionModel,
    mode = "create",
    initialData,
  } = props;

  const [form, setForm] = useState({
    content: "",
    options: ["", ""],
    correctAnswer: "",
    score: 1,
  });
  const { mutate: approve } = useApproveQuestion();
  useEffect(() => {
    if (isOpenQuestionModel) {
      if (mode !== "create" && initialData) {
        setForm({
          content: initialData.content || "",
          options:
            initialData.options && initialData.options.length > 0
              ? initialData.options
              : ["", ""],
          correctAnswer: initialData.correctAnswer || "",
          score: initialData.score || 1,
        });
      } else {
        setForm({
          content: "",
          options: ["", ""],
          correctAnswer: "",
          score: 1,
        });
      }
    }
  }, [isOpenQuestionModel, mode, initialData]);

  const handleContentChange = (value: string) => {
    setForm((prev) => ({ ...prev, content: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...form.options];
    const oldValue = newOptions[index];
    newOptions[index] = value;

    setForm((prev) => ({
      ...prev,
      options: newOptions,
      correctAnswer: prev.correctAnswer === oldValue ? "" : prev.correctAnswer,
    }));
  };

  const addAnswer = () => {
    if (form.options.length >= 6) return;

    setForm((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  const removeAnswer = (index: number) => {
    const removed = form.options[index];
    const newOptions = form.options.filter((_, i) => i !== index);

    setForm((prev) => ({
      ...prev,
      options: newOptions,
      correctAnswer: prev.correctAnswer === removed ? "" : prev.correctAnswer,
    }));
  };

  const hasCorrectAnswer = !!form.correctAnswer;

  const isValid =
    form.content.trim() &&
    form.options.filter((o) => o.trim() !== "").length >= 2 &&
    hasCorrectAnswer;

  const handleSubmit = () => {
    const payload = {
      content: form.content,
      options: form.options.filter((o) => o.trim() !== ""),
      correctAnswer: form.correctAnswer,
      score: form.score,
    };

    if (mode === "create") {
      createQuestion(payload, {
        onSuccess: () => {
          setIsOpenQuestionModel(false);
        },
      });
    } else if (mode === "edit" && initialData?._id) {
      updateQuestion(
        { id: initialData._id, body: payload },
        {
          onSuccess: () => {
            setIsOpenQuestionModel(false);
          },
        },
      );
    }
  };

  const handleApprove = () => {
    approve({
      id: initialData?._id as string,
      status: ApprovalStatus.IN_REVIEW,
    });
  };

  const isReadOnly = mode === "view";

  return (
    <>
      {isOpenQuestionModel && (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-8">
          <Card className="!mt-0 w-full border-none overflow-hidden p-0 relative my-auto shadow-2xl">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 border-b border-slate-700 sticky top-0 z-10">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-slate-300 hover:text-white hover:bg-slate-700"
                  onClick={() => setIsOpenQuestionModel(false)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Quay lại
                </Button>

                {!isReadOnly ? (
                  <Button
                    className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
                    disabled={!isValid}
                    onClick={handleSubmit}
                  >
                    <Check className="h-4 w-4" />
                    {mode === "create" ? "Xác nhận thêm" : "Lưu thay đổi"}
                  </Button>
                ) : (
                  <Button
                    className="bg-gradient-to-r from-emerald-600 to-teal-700 cursor-pointer"
                    onClick={() => {
                      (handleApprove(), setIsOpenQuestionModel(false));
                    }}
                  >
                    <MessageSquareCheck />
                    Trình duyệt
                  </Button>
                )}
              </div>

              <CardTitle className="text-2xl font-bold text-white">
                {mode === "create"
                  ? "Thêm câu hỏi mới"
                  : mode === "edit"
                    ? "Cập nhật câu hỏi"
                    : "Chi tiết câu hỏi"}
              </CardTitle>
              <p className="text-slate-400 text-sm mt-1">
                {mode === "create"
                  ? "Tạo câu hỏi và thiết lập đáp án"
                  : mode === "edit"
                    ? "Chỉnh sửa nội dung và đáp án"
                    : "Xem chi tiết câu hỏi và đáp án"}
              </p>
            </div>

            <CardContent className="space-y-6 p-6">
              {/* QUESTION */}
              <div className="space-y-2">
                <Label className="text-base font-semibold text-slate-700">
                  Câu hỏi <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  value={form.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Nhập nội dung câu hỏi..."
                  disabled={isReadOnly}
                  className="min-h-[120px] resize-y border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                />
              </div>

              {/* OPTIONS */}
              <div className="space-y-3">
                <Label className="text-base font-semibold text-slate-700">
                  Đáp án <span className="text-red-500">*</span>
                </Label>

                <RadioGroup
                  value={form.correctAnswer}
                  onValueChange={(value) =>
                    !isReadOnly &&
                    setForm((prev) => ({
                      ...prev,
                      correctAnswer: value,
                    }))
                  }
                >
                  {form.options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        form.correctAnswer !== "" &&
                        option === form.correctAnswer &&
                        option !== ""
                          ? "bg-emerald-50 border-2 border-emerald-200"
                          : "bg-white border border-slate-200"
                      }`}
                    >
                      <RadioGroupItem
                        value={option}
                        disabled={isReadOnly || option === ""}
                      />

                      <Input
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        placeholder={`Đáp án ${String.fromCharCode(65 + index)}`}
                        disabled={isReadOnly}
                        className="border-0 bg-transparent px-0 focus-visible:ring-0 disabled:opacity-100 disabled:cursor-not-allowed"
                      />

                      {!isReadOnly && form.options.length > 2 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAnswer(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </RadioGroup>

                {/* ADD */}
                {!isReadOnly && form.options.length < 6 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addAnswer}
                    className="gap-1 mt-2 border-dashed border-2"
                  >
                    <Plus className="h-4 w-4" />
                    Thêm đáp án
                  </Button>
                )}

                {!isReadOnly && form.options.length >= 6 && (
                  <p className="text-xs text-amber-600 mt-2">Tối đa 6 đáp án</p>
                )}
              </div>

              {/* STATUS */}
              {!hasCorrectAnswer ? (
                <div className="bg-amber-50 p-4 text-sm text-amber-800 flex gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Chưa chọn đáp án đúng
                </div>
              ) : (
                <div className="bg-emerald-50 p-4 text-sm text-emerald-800 flex gap-2">
                  <Check className="h-5 w-5" />
                  {isReadOnly ? "Hiển thị đáp án đúng" : "Đã sẵn sàng"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default QuestionModel;
