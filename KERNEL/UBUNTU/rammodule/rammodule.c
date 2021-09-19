/* SPDX-License-Identifier: GPL-2.0 */
#include <linux/module.h>
#include <linux/init.h>
#include <linux/kernel.h>
#include <linux/fs.h>
#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <asm/uaccess.h>

#define PROCFS_NAME "rammodule"

/* to get works meminfo */
#include <linux/hugetlb.h>
#include <linux/mm.h>
#include <linux/mman.h>
#include <linux/mmzone.h>
#include <linux/swap.h>
#include <linux/vmstat.h>
#include <linux/atomic.h>
#include <asm/page.h>
#include <asm/pgtable.h>

#include <linux/percpu.h>
#include <linux/vmalloc.h>
#include <linux/configfs.h>

#ifdef CONFIG_CMA
#include <linux/cma.h>
#endif

struct sysinfo i;
unsigned long cached;
unsigned long memorytotal;
double a;
unsigned long pages[NR_LRU_LISTS];
int lru;

static int OS2_show(struct seq_file *m, void *v)
{
	//seq_printf(m, "Proceso:\n");
	//seq_printf(m, "\n");

#define K(x) ((x) << (PAGE_SHIFT - 10))
	si_meminfo(&i);
	cached = global_node_page_state(NR_FILE_PAGES) -
			 global_node_page_state(QC_SPACE) - i.bufferram;
	if (cached < 0)
		cached = 0;
	for (lru = LRU_BASE; lru < NR_LRU_LISTS; lru++)
		pages[lru] = global_node_page_state(NR_LRU_BASE + lru);

	/*seq_printf(m, "Memoria Total: %8lu KB\n", K(i.totalram));
	seq_printf(m, "Memoria En Uso: %8ld KB\n", ((K(i.totalram) - (K(i.freeram) + K(i.bufferram) + K(cached)))));
	seq_printf(m, "Memoria Libre: %8ld KB\n", (K(i.freeram)));
	seq_printf(m, "Cached: %8ld KB\n", (K(cached)));
	seq_printf(m, "Buffers: %8ld KB\n", (K(i.bufferram)));
	seq_printf(m, "Porcentaje de memoria en uso: %8ld \n", (((K(i.totalram) - (K(i.freeram) + K(i.bufferram) + K(cached))) * 100) / (K(i.totalram))));*/

	seq_printf(m, "%8lu\n", K(i.totalram));
	seq_printf(m, "%8ld\n", ((K(i.totalram) - (K(i.freeram) + K(i.bufferram) + K(cached)))));
	seq_printf(m, "%8ld\n", (K(i.freeram)));
	seq_printf(m, "%8ld\n", (K(cached)));
	seq_printf(m, "%8ld\n", (K(i.bufferram)));
	seq_printf(m, "%8ld", (((K(i.totalram) - (K(i.freeram) + K(i.bufferram) + K(cached))) * 100) / (K(i.totalram))));

#undef K
	return 0;
}

static int OS2_open(struct inode *inode, struct file *file)
{
	return single_open(file, OS2_show, NULL);
}

static const struct proc_ops OS2_fops = {
	.proc_open = OS2_open,
	.proc_read = seq_read,
	.proc_lseek = seq_lseek,
	.proc_release = single_release,
};

static int __init OS2_init(void)
{
	printk(KERN_INFO "Cargando modulo.\r\n");
	proc_create(PROCFS_NAME, 0, NULL, &OS2_fops);
	printk(KERN_INFO "Completado. Procceso: /proc/%s.\r\n", PROCFS_NAME);
	return 0;
}

static void __exit OS2_exit(void)
{
	remove_proc_entry(PROCFS_NAME, NULL);
	printk(KERN_INFO "Modulo deshabilitado.\r\n");
}

module_init(OS2_init);
module_exit(OS2_exit);
MODULE_DESCRIPTION("módulo que lee la RAM del sistema");
MODULE_LICENSE("Grupo10");
