<?php
$current_type = isset($_GET['type']) ? $_GET['type'] : 'personal';
?>
<aside class="sidebar">
    <h2>Todo App</h2>
    <nav>
        <ul>
            <li class="<?= $current_type === 'personal' ? 'active' : '' ?>">
                <a href="index.php?type=personal">📌 Personal</a>
            </li>
            <li class="<?= $current_type === 'shared' ? 'active' : '' ?>">
                <a href="index.php?type=shared">👥 Shared</a>
            </li>
        </ul>
    </nav>
</aside>