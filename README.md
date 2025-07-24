# ScriptHub 🚀

A hybrid desktop application designed to discover, manage, and execute local scripts through a clean, modern graphical user interface with a Github-like theme.

*A preview of the ScriptHub dashboard, showcasing a clean and intuitive interface for script management.*

## The Problem 💡

Powerful command-line scripts are often inaccessible to users who are not comfortable with the terminal. ScriptHub bridges this gap by providing an intelligent and user-friendly interface for automation, combining the security of local execution with the collaborative power of a future online community.

## ✨ Key Features

* **Secure Local Execution:** All scripts are run entirely on the user's machine in a sandboxed process. No personal data or code is ever uploaded without explicit action.

* **Dynamic UI Generation:** ScriptHub reads a `metadata.json` file for each script and automatically builds the necessary input forms, making any script instantly usable.

* **Extensible Module System:** Adding your own tools is as simple as creating a folder with your script and its metadata file.

* **Centralized Dashboard:** Discover, search, and filter all your scripts—whether they are official, personal, or from the community—in one clean interface.

* **(Planned) Community Library:** A future online backend will allow users to share, discover, and download useful scripts created by the community.

## 💡 Architectural Highlights

This project is built on modern development principles to create a robust and maintainable application.

* **Component-Based Architecture:** The UI is built with React, breaking down complex interfaces into small, reusable, and independent components.

* **Centralized State Management:** The application follows the "lifting state up" pattern, where a single parent component (`App.jsx`) owns the core data and logic, passing it down to child components via props. This creates a predictable and unidirectional data flow.

* **Custom Hooks for Reusability:** Repetitive logic (like form handling) is extracted into custom hooks (`useForm`) to keep components clean and DRY ("Don't Repeat Yourself").

* **Hybrid Application Model:** The project is designed to be an Electron desktop app, wrapping modern web technologies (React, Node.js) to create a native, cross-platform experience.

## 💻 Tech Stack

| Area | Technology |
 | ----- | ----- |
| Front-End | React, JavaScript, HTML, CSS (Tailwind CSS for styling) |
| Desktop App | Electron, Node.js |
| (Planned) Backend | Node.js, Express.js |
| (Planned) Database | MongoDB (or similar NoSQL database) |
| Styling | Tailwind CSS, Custom CSS |
| Testing | Jest, React Testing Library (Planned) |

## ✅ Final State of the App

ScriptHub aims to be the ultimate desktop companion for script enthusiasts and automation seekers. Upon completion, the application will provide a seamless experience for:

* **Effortless Script Management:** Users will easily discover, organize, and execute a wide array of local scripts through an intuitive graphical interface, eliminating the need for command-line expertise.

* **Secure & Sandboxed Execution:** All scripts will run securely within a sandboxed environment on the user's local machine, ensuring privacy and system integrity.

* **Dynamic and Adaptable Forms:** The application will dynamically generate user interfaces based on script metadata, making any script immediately accessible and runnable without manual configuration.

* **Thriving Community Hub:** A robust online community library will allow users to share their creations, discover new tools, and collaborate, fostering a rich ecosystem of automation scripts.

* **Cross-Platform Accessibility:** As an Electron-based desktop application, ScriptHub will offer a consistent and native experience across Windows, macOS, and Linux.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project

2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)

3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)

4. Push to the Branch (`git push origin feature/AmazingFeature`)

5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Contact

Filip Bogosel - filip.bogosel.dev@gmail.com

Project Link: https://github.com/FilipBogosel/ScriptHub
