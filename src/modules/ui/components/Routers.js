import React, { useEffect, useState } from 'react'

import { Routes, Route } from 'react-router-dom'

import HomeRoutes from 'modules/home/components/Router'
import SupportRoutes from 'modules/supports/components/Router'
import AssessmentRoutes from 'modules/assessments/components/Router'
import AnswerRoutes from 'modules/answers/components/Router'
import CommentRoutes from 'modules/comments/components/Router'

export default function Routers() {
  return (
    <Routes>
      {/* ไอทีซัพพอร์ต */}
      <Route path="itcal/supports/*" element={<SupportRoutes />}></Route>

      {/* แบบประเมิน */}
      <Route path="itcal/assessments/*" element={<AssessmentRoutes />}></Route>

      {/* คำตอบแบบประเมิน */}
      <Route path="itcal/answers/*" element={<AnswerRoutes />}></Route>

      {/* แสดงความคิดเห็น */}
      <Route path="itcal/comments/*" element={<CommentRoutes />}></Route>

      <Route path="itcal/*" element={<HomeRoutes />}></Route>
    </Routes>
  )
}
