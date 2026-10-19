<?php
require_once 'config.php';

$type = isset($_GET['type']) && $_GET['type'] === 'shared' ? 'shared' : 'personal';

// --- HANDLER ACTION (CRUD + FILE HANDLING) ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. TAMBAH TODO
    if (isset($_POST['action']) && $_POST['action'] === 'add') {
        $title = trim($_POST['title']);
        $description = trim($_POST['description']);
        $todo_type = $_POST['type'];
        $attachment_name = NULL;

        // Handling File Upload
        if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
            $upload_dir = 'uploads/';
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }
            $file_ext = pathinfo($_FILES['attachment']['name'], PATHINFO_EXTENSION);
            $attachment_name = time() . '_' . uniqid() . '.' . $file_ext;
            move_uploaded_file($_FILES['attachment']['tmp_name'], $upload_dir . $attachment_name);
        }

        if (!empty($title)) {
            $stmt = $conn->prepare("INSERT INTO todos (title, description, type, attachment) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $title, $description, $todo_type, $attachment_name);
            $stmt->execute();
            $stmt->close();
        }
        header("Location: index.php?type=" . $todo_type);
        exit();
    }

    // 2. TOGGLE STATUS (COMPLETE / PENDING)
    if (isset($_POST['action']) && $_POST['action'] === 'toggle') {
        $id = (int)$_POST['id'];
        $status = $_POST['status'] === 'completed' ? 'pending' : 'completed';
        $stmt = $conn->prepare("UPDATE todos SET status = ? WHERE id = ?");
        $stmt->bind_param("si", $status, $id);
        $stmt->execute();
        $stmt->close();
        header("Location: index.php?type=" . $type);
        exit();
    }

    // 3. HAPUS TODO
    if (isset($_POST['action']) && $_POST['action'] === 'delete') {
        $id = (int)$_POST['id'];
        
        // Hapus file jika ada
        $stmt = $conn->prepare("SELECT attachment FROM todos WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $res = $stmt->get_result()->fetch_assoc();
        if (!empty($res['attachment']) && file_exists('uploads/' . $res['attachment'])) {
            unlink('uploads/' . $res['attachment']);
        }
        $stmt->close();

        $stmt = $conn->prepare("DELETE FROM todos WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->close();
        header("Location: index.php?type=" . $type);
        exit();
    }
}

// --- READ TODO ---
$stmt = $conn->prepare("SELECT * FROM todos WHERE type = ? ORDER BY created_at DESC");
$stmt->bind_param("s", $type);
$stmt->execute();
$todos = $stmt->get_result();
?>

<main class="content">
    <h1>Daftar Tugas (<?= ucfirst($type) ?>)</h1>

    <!-- Form Tambah Todo -->
    <form action="content.php?type=<?= $type ?>" method="POST" enctype="multipart/form-data" class="todo-form">
        <input type="hidden" name="action" value="add">
        <input type="hidden" name="type" value="<?= $type ?>">
        
        <input type="text" name="title" placeholder="Judul tugas..." required>
        <textarea name="description" placeholder="Deskripsi (opsional)..."></textarea>
        
        <label for="attachment">Lampiran File (opsional):</label>
        <input type="file" name="attachment" id="attachment">

        <button type="submit">Tambah Tugas</button>
    </form>

    <hr>

    <!-- List Tugas -->
    <ul class="todo-list">
        <?php if ($todos->num_rows > 0): ?>
            <?php while ($row = $todos->fetch_assoc()): ?>
                <li class="todo-item <?= $row['status'] ?>">
                    <div class="todo-info">
                        <h3><?= htmlspecialchars($row['title']) ?></h3>
                        <p><?= htmlspecialchars($row['description']) ?></p>
                        <?php if ($row['attachment']): ?>
                            <p>📁 Lampiran: <a href="uploads/<?= $row['attachment'] ?>" target="_blank">Lihat Berkas</a></p>
                        <?php endif; ?>
                    </div>
                    
                    <div class="todo-actions">
                        <!-- Toggle Status -->
                        <form action="content.php?type=<?= $type ?>" method="POST" style="display:inline;">
                            <input type="hidden" name="action" value="toggle">
                            <input type="hidden" name="id" value="<?= $row['id'] ?>">
                            <input type="hidden" name="status" value="<?= $row['status'] ?>">
                            <button type="submit"><?= $row['status'] === 'completed' ? 'Undo' : 'Selesai' ?></button>
                        </form>

                        <!-- Delete -->
                        <form action="content.php?type=<?= $type ?>" method="POST" style="display:inline;">
                            <input type="hidden" name="action" value="delete">
                            <input type="hidden" name="id" value="<?= $row['id'] ?>">
                            <button type="submit" class="btn-delete" onclick="return confirm('Yakin ingin menghapus?')">Hapus</button>
                        </form>
                    </div>
                </li>
            <?php endwhile; ?>
        <?php else: ?>
            <p>Belum ada tugas di kategori ini.</p>
        <?php endif; ?>
    </ul>
</main>