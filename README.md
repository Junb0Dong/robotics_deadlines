# Robotics & AI Deadlines

机器人、人工智能、机器学习和计算机视觉会议投稿截止日期：

`https://junb0dong.github.io/robotics_deadlines/`

## 更新会议

编辑 [`data/conferences.json`](data/conferences.json)。正式日期必须来自会议官网或
官方 CFP，并使用带时区的 ISO 8601 格式：

```json
{
  "acronym": "ICRA",
  "edition": "2027",
  "name": "IEEE International Conference on Robotics and Automation",
  "area": "Robotics",
  "ccf": "B",
  "deadlineType": "Full paper",
  "deadline": "2026-09-15T23:59:59-12:00",
  "expectedWindow": null,
  "sortDate": "2026-09-15",
  "source": "https://official-conference.example/call-for-papers"
}
```

如果官方尚未公布日期，将 `deadline` 设为 `null`，并填写大致时间段：

```json
{
  "deadline": null,
  "expectedWindow": "2027 Q1",
  "sortDate": "2027-02-15"
}
```

`sortDate` 仅决定 TBA 记录的展示顺序，不会作为正式截稿日期显示。

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
