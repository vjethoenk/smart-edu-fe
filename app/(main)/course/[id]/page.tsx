"use client";
import { useGetByIdCourse } from "@/features/course/hook";
import CourseHeader from "../components/CourseHeader";
import CoursePreview from "../components/CoursePreview";
import CourseTabs from "../components/CourseTabs";
import InstructorCard from "../components/InstructorCard";
import PriceCard from "../components/PriceCard";
import { useParams } from "next/navigation";
import { ICourse, IUser } from "@/types/api";

export default function CoursePage() {
  const id = useParams().id;
  const { data: courseDetails } = useGetByIdCourse(id as string);
  return (
    <div className="container mx-auto px-8 py-6">
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="col-span-8">
          <CourseHeader courseDetails={courseDetails as ICourse} />
          <CoursePreview url={courseDetails?.thumbnail || ""} />
          <CourseTabs courseDetails={courseDetails as ICourse} />
        </div>

        {/* RIGHT */}
        <div className="col-span-4 space-y-6">
          <PriceCard
            price={courseDetails?.price as number | undefined}
            courseId={courseDetails?._id as string}
          />
          <InstructorCard instructor={courseDetails?.createBy as IUser} />
        </div>
      </div>
    </div>
  );
}
