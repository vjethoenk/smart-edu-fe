import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WhatYouLearn from "./WhatYouLearn";
import { ICourse } from "@/types/api";
import Curriculum from "./Curriculum";
import { BookOpen, Library, Star } from "lucide-react";

export default function CourseTabs({
  courseDetails,
}: {
  courseDetails: ICourse;
}) {
  return (
    <Tabs defaultValue="overview" className="mt-6 flex flex-col">
      <TabsList className="bg-gray-100 p-1 rounded-full w-fit gap-1">
        <TabsTrigger
          value="overview"
          className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-semibold rounded-full px-5 py-2 transition-all duration-200 flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          <span>Mô tả</span>
        </TabsTrigger>

        <TabsTrigger
          value="curriculum"
          className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-semibold rounded-full px-5 py-2 transition-all duration-200 flex items-center gap-2"
        >
          <Library className="w-4 h-4" />
          <span>Nội dung</span>
        </TabsTrigger>

        <TabsTrigger
          value="reviews"
          className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-semibold rounded-full px-5 py-2 transition-all duration-200 flex items-center gap-2"
        >
          <Star className="w-4 h-4" />
          <span>Đánh giá</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <WhatYouLearn description={courseDetails?.description} />
      </TabsContent>

      <TabsContent value="curriculum" className="mt-6">
        <Curriculum courseDetails={courseDetails} />
      </TabsContent>
    </Tabs>
  );
}
