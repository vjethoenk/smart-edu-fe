import { useGetCategoryById } from "@/features/category/hook";
import { ICourse } from "@/types/api";

export default function CourseHeader({
  courseDetails,
}: {
  courseDetails: ICourse;
}) {
  const { data } = useGetCategoryById(courseDetails?.categoryId);
  return (
    <div className="mb-4">
      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-md">
        {data?.name}
      </span>

      <h1 className="text-3xl font-bold mt-2">{courseDetails?.title}</h1>

      {/* <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
        <span>⭐ 4.9</span>
        <span>12,406 reviews</span>
        <span>45,680 students enrolled</span>
        <span>English, Spanish</span>
      </div> */}
    </div>
  );
}
