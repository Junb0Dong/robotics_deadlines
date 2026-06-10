# Robotics & AI Deadlines

机器人、人工智能、机器学习和计算机视觉会议投稿截止日期：

`https://junb0dong.github.io/robotics_deadlines/`

## 更新会议

编辑 [`data/conferences.json`](data/conferences.json)。日期使用带时区的 ISO 8601
格式，并通过 `status` 区分官方日期与预测日期：

```json
{
  "acronym": "ICRA",
  "edition": "2027",
  "name": "IEEE International Conference on Robotics and Automation",
  "area": "Robotics",
  "ccf": "B",
  "deadlineType": "Full paper",
  "deadline": "2026-09-15T23:59:59-12:00",
  "status": "estimated",
  "expectedWindow": null,
  "sortDate": "2026-09-15",
  "source": "https://official-conference.example/call-for-papers"
}
```

`confirmed` 表示会议官网或官方 CFP 已公布；`estimated` 表示根据上一届官方日期、
固定年度规律或公开维护数据预测。预测记录的 `source` 应指向推算依据。

## 本地预览

```bash
python3 -m http.server 8000
```

访问 `http://localhost:8000`。

## 数据检查

```bash
npm run validate
```

推送到 `main` 后，GitHub Actions 会先检查数据，再部署 GitHub Pages。

## 致谢

网站受 [Robotics-Deadlines](https://github.com/zhikai-02/Robotics-Deadlines)
启发。参考项目采用 MIT License；本项目重新实现为适合 GitHub Pages 的纯静态站点。
